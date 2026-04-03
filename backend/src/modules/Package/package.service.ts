import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { Prisma } from '../../../generated/prisma/client';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { packageSearchableFields } from './package.constant';

const createPackageIntoDB = async (payload: any, user: JwtPayload) => {
  // Check if agency is verified
  const agency = await prisma.user.findUnique({ where: { id: user.userId } });
  if (!agency) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!agency.isVerified) {
    throw new AppError(httpStatus.FORBIDDEN, 'Agency is not verified to create packages');
  }

  const result = await prisma.package.create({
    data: {
      ...payload,
      agencyId: user.userId,
    },
  });
  return result;
};

const getAllPackagesFromDB = async (query: any) => {
  const { 
    page = 1, 
    limit = 10, 
    searchTerm, 
    destination, 
    title, 
    minPrice, 
    maxPrice, 
    sortBy = 'createdAt', 
    sortOrder = 'desc' 
  } = query;
  
  const skip = (Number(page) - 1) * Number(limit);

  const andConditions: Prisma.PackageWhereInput[] = [];

  // isActive should be true for public queries
  andConditions.push({ isActive: true });

  if (searchTerm) {
    andConditions.push({
      OR: packageSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm as string,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (destination) {
    andConditions.push({
      destination: {
        contains: destination as string,
        mode: 'insensitive',
      },
    });
  }

  if (title) {
    andConditions.push({
      title: {
        contains: title as string,
        mode: 'insensitive',
      },
    });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      price: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    });
  }

  const whereConditions: Prisma.PackageWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  const packages = await prisma.package.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    orderBy: { [sortBy as string]: sortOrder as string },
    include: {
      agency: {
         select: { id: true, name: true, profileImage: true }
      }
    }
  });

  const total = await prisma.package.count({ where: whereConditions });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: packages,
  };
};

const getPackageByIdFromDB = async (id: string) => {
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: {
      agency: {
        select: { id: true, name: true, bio: true, profileImage: true, rating: true }
      },
      reviews: {
        include: {
          traveler: { select: { id: true, name: true, profileImage: true } }
        }
      }
    }
  });

  if (!pkg) {
    throw new AppError(httpStatus.NOT_FOUND, 'Package not found');
  }
  return pkg;
};

const updatePackageIntoDB = async (id: string, payload: any, user: JwtPayload) => {
  const pkg = await prisma.package.findUnique({ where: { id } });
  if (!pkg) {
    throw new AppError(httpStatus.NOT_FOUND, 'Package not found');
  }

  if (pkg.agencyId !== user.userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update this package');
  }

  const result = await prisma.package.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deletePackageFromDB = async (id: string, user: JwtPayload) => {
  const pkg = await prisma.package.findUnique({ where: { id } });
  if (!pkg) {
    throw new AppError(httpStatus.NOT_FOUND, 'Package not found');
  }

  if (pkg.agencyId !== user.userId && user.role !== 'ADMIN') {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to delete this package');
  }

  const result = await prisma.package.delete({ where: { id } });
  return result;
};

export const PackageService = {
  createPackageIntoDB,
  getAllPackagesFromDB,
  getPackageByIdFromDB,
  updatePackageIntoDB,
  deletePackageFromDB,
};
