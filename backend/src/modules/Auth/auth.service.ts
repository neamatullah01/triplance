import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import config from '../../config';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import { User } from '../../../generated/prisma/client';

const registerUser = async (payload: any) => {
  const { name, email, password, role } = payload;

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds)
  );

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role ? role : 'TRAVELER',
      isVerified: role === 'AGENCY' ? false : true,
    },
  });

  // Exclude password from the response
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (user.isBanned) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is banned!');
  }

  const isPasswordMatched = await bcrypt.compare(payload.password!, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.access_secret as string,
    config.jwt.access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
  };
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt.refresh_secret as string);

  const { email } = decoded;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (user.isBanned) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is banned!');
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.access_secret as string,
    config.jwt.access_expires_in as string
  );

  return {
    accessToken,
  };
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken,
};