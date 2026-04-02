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

export const PostService = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
