import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { JwtPayload } from 'jsonwebtoken';

const likePost = async (postId: string, user: JwtPayload) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: user.userId,
        postId,
      }
    }
  });

  if (existingLike) {
    throw new AppError(httpStatus.CONFLICT, 'You have already liked this post');
  }

  const result = await prisma.like.create({
    data: {
      userId: user.userId,
      postId,
    },
  });

  return result;
};

const unlikePost = async (postId: string, user: JwtPayload) => {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: user.userId,
        postId,
      }
    }
  });

  if (!existingLike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Like not found');
  }

  const result = await prisma.like.delete({
    where: {
      id: existingLike.id,
    },
  });

  return result;
};

export const LikeService = {
  likePost,
  unlikePost,
};
