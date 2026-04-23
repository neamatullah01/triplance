import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { Prisma } from "../../../generated/prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { packageSearchableFields } from "./package.constant";
import { uploadToCloudinary } from "../../utils/cloudinary";

const createPackage = async (agencyId: string, payload: any) => {
  // 1. Extract Base64 string from payload
  const base64Image =
    payload.images && payload.images.length > 0 ? payload.images[0] : null;

  if (!base64Image) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cover image is required");
  }

  // 2. Upload Base64 to Cloudinary
  // Assuming uploadToCloudinary accepts either a file path OR a base64 string
  const uploadedImage = await uploadToCloudinary(base64Image);

  if (!uploadedImage) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Image upload failed. Please try again.",
    );
  }

  const secureImageUrl = uploadedImage.secure_url;

  // 3. Create the package in the database
  // Note: No need for JSON.parse() here because express.json() already parsed the body natively!
  const newPackage = await prisma.package.create({
    data: {
      agencyId,
      title: payload.title,
      description: payload.description,
      price: payload.price,
      maxCapacity: payload.maxCapacity,
      destination: payload.destination,
      lastBookingDay: new Date(payload.lastBookingDay),
      availableDates: payload.availableDates.map((d: string) => new Date(d)),
      amenities: payload.amenities,
      itinerary: payload.itinerary,
      images: [secureImageUrl], // Array of image URLs per PRD
      isActive: true,
    },
  });

  return newPackage;
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
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const andConditions: Prisma.PackageWhereInput[] = [];

  // isActive should be true for public queries
  andConditions.push({ isActive: true });

  // Exclude packages whose lastBookingDay has already passed.
  // Packages with no lastBookingDay set are always visible.
  andConditions.push({
    OR: [{ lastBookingDay: null }, { lastBookingDay: { gte: new Date() } }],
  });

  if (searchTerm) {
    andConditions.push({
      OR: packageSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm as string,
          mode: "insensitive",
        },
      })),
    });
  }

  if (destination) {
    andConditions.push({
      destination: {
        contains: destination as string,
        mode: "insensitive",
      },
    });
  }

  if (title) {
    andConditions.push({
      title: {
        contains: title as string,
        mode: "insensitive",
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

  const whereConditions: Prisma.PackageWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const packages = await prisma.package.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    orderBy: { [sortBy as string]: sortOrder as string },
    include: {
      agency: {
        select: { id: true, name: true, profileImage: true },
      },
    },
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

const getMyAgencyPackagesFromDB = async (user: JwtPayload, query: any) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    destination,
    title,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const andConditions: Prisma.PackageWhereInput[] = [];

  // Filter by agencyId from payload
  andConditions.push({ agencyId: user.userId });

  if (searchTerm) {
    andConditions.push({
      OR: packageSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm as string,
          mode: "insensitive",
        },
      })),
    });
  }

  if (destination) {
    andConditions.push({
      destination: {
        contains: destination as string,
        mode: "insensitive",
      },
    });
  }

  if (title) {
    andConditions.push({
      title: {
        contains: title as string,
        mode: "insensitive",
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

  const whereConditions: Prisma.PackageWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const packages = await prisma.package.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    orderBy: { [sortBy as string]: sortOrder as string },
    include: {
      agency: {
        select: { id: true, name: true, profileImage: true },
      },
    },
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
        select: {
          id: true,
          name: true,
          bio: true,
          profileImage: true,
          rating: true,
        },
      },
      reviews: {
        include: {
          traveler: { select: { id: true, name: true, profileImage: true } },
        },
      },
    },
  });

  if (!pkg) {
    throw new AppError(httpStatus.NOT_FOUND, "Package not found");
  }
  return pkg;
};

const updatePackage = async (
  agencyId: string,
  packageId: string,
  payload: any,
) => {
  // 1. Verify ownership[cite: 1]
  const existingPackage = await prisma.package.findUnique({
    where: { id: packageId },
  });

  if (!existingPackage) {
    throw new AppError(httpStatus.NOT_FOUND, "Package not found");
  }
  if (existingPackage.agencyId !== agencyId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You do not have permission to edit this package",
    );
  }

  // 2. Handle Image Update (Check if the incoming image is a new Base64 string)
  let imageUrl = existingPackage.images[0];
  if (
    payload.images &&
    payload.images.length > 0 &&
    payload.images[0].startsWith("data:image")
  ) {
    const uploadedImage = await uploadToCloudinary(payload.images[0]);
    if (!uploadedImage) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Image upload failed. Please try again.",
      );
    }
    imageUrl = uploadedImage.secure_url;
  }

  // 3. Update the package
  const updatedPackage = await prisma.package.update({
    where: { id: packageId },
    data: {
      title:
        payload.title !== undefined ? payload.title : existingPackage.title,
      description:
        payload.description !== undefined
          ? payload.description
          : existingPackage.description,
      price:
        payload.price !== undefined ? payload.price : existingPackage.price,
      maxCapacity:
        payload.maxCapacity !== undefined
          ? payload.maxCapacity
          : existingPackage.maxCapacity,
      destination:
        payload.destination !== undefined
          ? payload.destination
          : existingPackage.destination,
      lastBookingDay: payload.lastBookingDay
        ? new Date(payload.lastBookingDay)
        : existingPackage.lastBookingDay,
      availableDates: payload.availableDates
        ? payload.availableDates.map((d: string) => new Date(d))
        : existingPackage.availableDates,
      amenities:
        payload.amenities !== undefined
          ? payload.amenities
          : existingPackage.amenities,
      itinerary:
        payload.itinerary !== undefined
          ? payload.itinerary
          : existingPackage.itinerary,
      images: [imageUrl],
    },
  });

  return updatedPackage;
};
const deletePackageFromDB = async (id: string, user: JwtPayload) => {
  const pkg = await prisma.package.findUnique({ where: { id } });
  if (!pkg) {
    throw new AppError(httpStatus.NOT_FOUND, "Package not found");
  }

  if (pkg.agencyId !== user.userId && user.role !== "ADMIN") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this package",
    );
  }

  const result = await prisma.package.delete({ where: { id } });
  return result;
};

export const PackageService = {
  createPackage,
  getAllPackagesFromDB,
  getMyAgencyPackagesFromDB,
  getPackageByIdFromDB,
  updatePackageIntoDB: updatePackage,
  deletePackageFromDB,
};
