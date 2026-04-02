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
      bio: true,
      rating: true,
      isVerified: true,
      isBanned: true,
      createdAt: true,
      _count: {
        select: {
          followers: true,
          packages: true,
        },
      },
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
      bio: true,
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

export const UserService = {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  banUser,
  approveAgency,
};