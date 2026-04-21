import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { JwtPayload } from 'jsonwebtoken';

const getAllUsers = async (query: any) => {
  const { page = 1, limit = 10, role } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereConditions: any = {};
  if (role) {
    whereConditions.role = role;
  }

  const users = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      bio: true,
      rating: true,
      isVerified: true,
      isBanned: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.user.count({ where: whereConditions });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: users,
  };
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      coverImage: true,
      bio: true,
      agencyName: true,
      website: true,
      rating: true,
      isVerified: true,
      isBanned: true,
      createdAt: true,
      _count: {
        select: {
          followers: true,
          following: true,
          packages: true,
          posts: true,
          reviewsReceived: true,
        },
      },
      posts: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              profileImage: true,
              isVerified: true,
            },
          },
          _count: { select: { likes: true, comments: true } },
        },
      },
      packages: {
        orderBy: { createdAt: 'desc' },
      },
      reviewsReceived: {
        orderBy: { createdAt: 'desc' },
        include: {
          traveler: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
      },
      followers: true,
      following: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

const updateProfile = async (id: string, payload: any, authUser: JwtPayload) => {
  if (authUser.role !== 'ADMIN' && authUser.userId !== id) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update this profile');
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      coverImage: true,
      bio: true,
      agencyName: true,
      website: true,
    },
  });

  return updatedUser;
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const deletedUser = await prisma.user.delete({
    where: { id },
  });

  return deletedUser;
};

const banUser = async (id: string, payload: { isBanned: boolean }) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      isBanned: payload.isBanned,
    },
    select: {
      id: true,
      email: true,
      name: true,
      isBanned: true,
    }
  });

  return updatedUser;
};

const approveAgency = async (id: string, payload: { isVerified: boolean }) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.role !== 'AGENCY') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Only agencies can be approved');
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      isVerified: payload.isVerified,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isVerified: true,
    }
  });

  return updatedUser;
};

const getSuggestedUsers = async (authUser: JwtPayload, query: any) => {
  const { page = 1, limit = 10, search } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // 1. Get all IDs the current user already follows
  const alreadyFollowing = await prisma.follow.findMany({
    where: { followerId: authUser.userId },
    select: { followingId: true },
  });
  const followingIds = alreadyFollowing.map((f) => f.followingId);

  // IDs to exclude: own account + already-followed users
  const excludeIds = [...followingIds, authUser.userId];

  // 2. Build search filter
  const searchFilter = search
    ? {
        OR: [
          { name: { contains: search as string, mode: 'insensitive' as const } },
          { bio: { contains: search as string, mode: 'insensitive' as const } },
        ],
      }
    : {};

  // 3. Try: find TRAVELER followers-of-followers (people your followees follow)
  let suggested: any[] = [];

  if (followingIds.length > 0) {
    // Get all users followed by the people I follow
    const followersOfFollowees = await prisma.follow.findMany({
      where: {
        followerId: { in: followingIds },
        followingId: { notIn: excludeIds },
      },
      select: { followingId: true },
      distinct: ['followingId'],
      take: skip + take,
    });

    const candidateIds = followersOfFollowees.map((f) => f.followingId);

    if (candidateIds.length > 0) {
      suggested = await prisma.user.findMany({
        where: {
          id: { in: candidateIds },
          isBanned: false,
          ...searchFilter,
        },
        select: {
          id: true,
          name: true,
          profileImage: true,
          bio: true,
          role: true,
          isVerified: true,
          _count: { select: { followers: true, posts: true } },
        },
        skip,
        take,
      });
    }
  }

  // 4. Fallback: if no network-based suggestions, show all TRAVELERs (excluding self and already-following)
  if (suggested.length === 0) {
    suggested = await prisma.user.findMany({
      where: {
        id: { notIn: excludeIds },
        role: 'TRAVELER',
        isBanned: false,
        ...searchFilter,
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
        bio: true,
        role: true,
        isVerified: true,
        _count: { select: { followers: true, posts: true } },
      },
      orderBy: { followers: { _count: 'desc' } },
      skip,
      take,
    });
  }

  // 5. Compute total for pagination metadata
  const total = await prisma.user.count({
    where: {
      id: { notIn: excludeIds },
      isBanned: false,
      ...searchFilter,
    },
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: suggested,
  };
};

const getAllAgenciesForUser = async (authUser: JwtPayload, query: any) => {
  const { page = 1, limit = 10, search } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const baseWhere = {
    role: 'AGENCY' as const,
    isBanned: false,
    isVerified: true,
    ...(search
      ? {
          OR: [
            { name: { contains: search as string, mode: 'insensitive' as const } },
            { bio: { contains: search as string, mode: 'insensitive' as const } },
            { agencyName: { contains: search as string, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const unfollowedWhere = {
    ...baseWhere,
    followers: { none: { followerId: authUser.userId } },
  };

  const followedWhere = {
    ...baseWhere,
    followers: { some: { followerId: authUser.userId } },
  };

  const totalUnfollowed = await prisma.user.count({ where: unfollowedWhere });
  const totalFollowed = await prisma.user.count({ where: followedWhere });
  const total = totalUnfollowed + totalFollowed;

  let mappedAgencies: any[] = [];

  const selectFields = {
    id: true,
    name: true,
    email: true,
    profileImage: true,
    coverImage: true, // Need this if you have it in DB, if not remove. Wait! Schema check
    bio: true,
    rating: true,
    isVerified: true,
    createdAt: true,
    _count: {
      select: {
        followers: true,
        packages: true,
      },
    },
  };
  
  // We notice from schema that Cover Image does not exist in schema.prisma, so remove it.
  delete (selectFields as any).coverImage;

  if (skip < totalUnfollowed) {
    const unfollowedAgencies = await prisma.user.findMany({
      where: unfollowedWhere,
      skip,
      take,
      select: selectFields,
      orderBy: { createdAt: 'desc' },
    });

    mappedAgencies = [...unfollowedAgencies.map(a => ({ ...a, isFollowed: false }))];

    if (mappedAgencies.length < take) {
      const remainingTake = take - mappedAgencies.length;
      const followedAgencies = await prisma.user.findMany({
        where: followedWhere,
        skip: 0,
        take: remainingTake,
        select: selectFields,
        orderBy: { createdAt: 'desc' },
      });
      mappedAgencies = [...mappedAgencies, ...followedAgencies.map(a => ({ ...a, isFollowed: true }))];
    }
  } else {
    const followedSkip = skip - totalUnfollowed;
    const followedAgencies = await prisma.user.findMany({
      where: followedWhere,
      skip: followedSkip,
      take,
      select: selectFields,
      orderBy: { createdAt: 'desc' },
    });
    mappedAgencies = [...followedAgencies.map(a => ({ ...a, isFollowed: true }))];
  }

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: mappedAgencies,
  };
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  banUser,
  approveAgency,
  getSuggestedUsers,
  getAllAgenciesForUser,
};