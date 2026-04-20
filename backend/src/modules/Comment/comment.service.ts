import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { JwtPayload } from 'jsonwebtoken';

const addComment = async (postId: string, payload: { text: string; parentId?: string }, user: JwtPayload) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const result = await prisma.comment.create({
    data: {
      text: payload.text,
      postId,
      userId: user.userId,
      parentId: payload.parentId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        }
      }
    }
  });

  return result;
};

const getCommentsByPost = async (postId: string) => {
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        }
      }
    },
    orderBy: { createdAt: 'asc' },
  });

  return comments;
};

const deleteComment = async (id: string, user: JwtPayload) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  if (comment.userId !== user.userId && user.role !== 'ADMIN') {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to delete this comment');
  }

  const result = await prisma.comment.delete({
    where: { id },
  });

  return result;
};

export const CommentService = {
  addComment,
  getCommentsByPost,
  deleteComment,
};
