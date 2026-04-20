import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { JwtPayload } from 'jsonwebtoken';

const createPost = async (payload: any, user: JwtPayload) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: user.userId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImage: true,
          role: true,
        }
      }
    }
  });

  return result;
};

const getAllPosts = async (query: any) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const posts = await prisma.post.findMany({
    skip,
    take: Number(limit),
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImage: true,
          role: true,
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.post.count();

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: posts,
  };
};

const getPostById = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImage: true,
          role: true,
        }
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        }
      }
    },
  });

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  return post;
};

const updatePost = async (id: string, payload: any, user: JwtPayload) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.authorId !== user.userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update this post');
  }

  const result = await prisma.post.update({
    where: { id },
    data: payload,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImage: true,
          role: true,
        }
      }
    }
  });

  return result;
};

const deletePost = async (id: string, user: JwtPayload) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.authorId !== user.userId && user.role !== 'ADMIN') {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to delete this post');
  }

  const result = await prisma.post.delete({
    where: { id },
  });

  return result;
};

const getAllFeedPost = async (user: JwtPayload, query: any) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // 1. Get the list of users and agencies the current user is following
  const following = await prisma.follow.findMany({
    where: { followerId: user.userId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);

  // 2. Fetch posts from following users & agencies & the user themselves
  // Since both TRAVELER and AGENCY roles are users, followingIds covers both
  const targetUserIds = [...followingIds, user.userId];

  const postsWhereClause = {
    authorId: { in: targetUserIds },
  };

  const posts = await prisma.post.findMany({
    where: postsWhereClause,
    orderBy: { createdAt: 'desc' },
    take: skip + take, // Fetch up to the needed items to ensure correct offset sorting
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImage: true,
          role: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: {
         where: {
            userId: user.userId
         },
         select: {
            id: true
         }
      }
    },
  });

  // 3. Fetch packages (all agency packages)
  const packages = await prisma.package.findMany({
    orderBy: { createdAt: 'desc' },
    take: skip + take,
    include: {
      agency: {
        select: {
          id: true,
          name: true,
          profileImage: true,
          role: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });

  // 4. Transform and merge into a common Feed entity
  const formattedPosts = posts.map((post) => ({
    ...post,
    feedType: 'POST', // distinguish feed item type
  }));

  const formattedPackages = packages.map((pkg) => ({
    id: pkg.id,
    content: `${pkg.title}\n\n${pkg.description}`, 
    images: pkg.images,
    location: pkg.destination,
    tags: pkg.amenities, 
    createdAt: pkg.createdAt,
    updatedAt: pkg.updatedAt,
    authorId: pkg.agencyId,
    author: pkg.agency,
    feedType: 'PACKAGE',
    packageDetails: pkg, // Provide original package data
    _count: {
      likes: 0, 
      comments: pkg._count.reviews,
    },
  }));

  // 5. Sort by createdAt descending
  const mergedFeed = [...formattedPosts, ...formattedPackages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // 6. Apply pagination slice
  const paginatedFeed = mergedFeed.slice(skip, skip + take);

  // Compute total elements for pagination metadata
  const totalPosts = await prisma.post.count({ where: postsWhereClause });
  const totalPackages = await prisma.package.count();
  const total = totalPosts + totalPackages;

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: paginatedFeed,
  };
};

export const PostService = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getAllFeedPost,
};
