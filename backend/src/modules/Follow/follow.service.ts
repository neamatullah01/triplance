import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { JwtPayload } from 'jsonwebtoken';

const followUser = async (followingId: string, user: JwtPayload) => {
  const followerId = user.userId;

  if (followerId === followingId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself');
  }

  // Check if following user exists
  const userToFollow = await prisma.user.findUnique({
    where: { id: followingId }
  });

  if (!userToFollow) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check unique constraint manually for better error message
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      }
    }
  });

  if (existingFollow) {
    throw new AppError(httpStatus.CONFLICT, 'You are already following this user');
  }

  const result = await prisma.follow.create({
    data: {
      followerId,
      followingId,
    }
  });

  return result;
};

const unfollowUser = async (followingId: string, user: JwtPayload) => {
  const followerId = user.userId;

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      }
    }
  });

  if (!existingFollow) {
    throw new AppError(httpStatus.NOT_FOUND, 'You are not following this user');
  }

  const result = await prisma.follow.delete({
    where: {
      id: existingFollow.id
    }
  });

  return result;
};

const getFollowers = async (id: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const followers = await prisma.follow.findMany({
    where: { followingId: id },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          profileImage: true,
          role: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return followers;
};

const getFollowing = async (id: string) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const following = await prisma.follow.findMany({
    where: { followerId: id },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          profileImage: true,
          role: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return following;
};

export const FollowService = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
