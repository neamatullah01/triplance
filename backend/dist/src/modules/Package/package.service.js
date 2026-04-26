"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../lib/prisma");
const package_constant_1 = require("./package.constant");
const cloudinary_1 = require("../../utils/cloudinary");
const createPackage = async (agencyId, payload) => {
    // 1. Extract Base64 string from payload
    const base64Image = payload.images && payload.images.length > 0 ? payload.images[0] : null;
    if (!base64Image) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cover image is required");
    }
    // 2. Upload Base64 to Cloudinary
    // Assuming uploadToCloudinary accepts either a file path OR a base64 string
    const uploadedImage = await (0, cloudinary_1.uploadToCloudinary)(base64Image);
    if (!uploadedImage) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Image upload failed. Please try again.");
    }
    const secureImageUrl = uploadedImage.secure_url;
    // 3. Create the package in the database
    // Note: No need for JSON.parse() here because express.json() already parsed the body natively!
    const newPackage = await prisma_1.prisma.package.create({
        data: {
            agencyId,
            title: payload.title,
            description: payload.description,
            price: payload.price,
            maxCapacity: payload.maxCapacity,
            destination: payload.destination,
            lastBookingDay: new Date(payload.lastBookingDay),
            availableDates: payload.availableDates.map((d) => new Date(d)),
            amenities: payload.amenities,
            itinerary: payload.itinerary,
            images: [secureImageUrl], // Array of image URLs per PRD
            isActive: true,
        },
    });
    return newPackage;
};
const getAllPackagesFromDB = async (query) => {
    const { page = 1, limit = 10, searchTerm, destination, title, minPrice, maxPrice, sortBy = "createdAt", sortOrder = "desc", } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const andConditions = [];
    // isActive should be true for public queries
    andConditions.push({ isActive: true });
    // Exclude packages whose lastBookingDay has already passed.
    // Packages with no lastBookingDay set are always visible.
    andConditions.push({
        OR: [{ lastBookingDay: null }, { lastBookingDay: { gte: new Date() } }],
    });
    if (searchTerm) {
        andConditions.push({
            OR: package_constant_1.packageSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (destination) {
        andConditions.push({
            destination: {
                contains: destination,
                mode: "insensitive",
            },
        });
    }
    if (title) {
        andConditions.push({
            title: {
                contains: title,
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const packages = await prisma_1.prisma.package.findMany({
        where: whereConditions,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
            agency: {
                select: { id: true, name: true, profileImage: true },
            },
        },
    });
    const total = await prisma_1.prisma.package.count({ where: whereConditions });
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: packages,
    };
};
const getMyAgencyPackagesFromDB = async (user, query) => {
    const { page = 1, limit = 10, searchTerm, destination, title, minPrice, maxPrice, sortBy = "createdAt", sortOrder = "desc", } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const andConditions = [];
    // Filter by agencyId from payload
    andConditions.push({ agencyId: user.userId });
    if (searchTerm) {
        andConditions.push({
            OR: package_constant_1.packageSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (destination) {
        andConditions.push({
            destination: {
                contains: destination,
                mode: "insensitive",
            },
        });
    }
    if (title) {
        andConditions.push({
            title: {
                contains: title,
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const packages = await prisma_1.prisma.package.findMany({
        where: whereConditions,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
            agency: {
                select: { id: true, name: true, profileImage: true },
            },
        },
    });
    const total = await prisma_1.prisma.package.count({ where: whereConditions });
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: packages,
    };
};
const getPackageByIdFromDB = async (id) => {
    const pkg = await prisma_1.prisma.package.findUnique({
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
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Package not found");
    }
    return pkg;
};
const updatePackage = async (agencyId, packageId, payload) => {
    // 1. Verify ownership[cite: 1]
    const existingPackage = await prisma_1.prisma.package.findUnique({
        where: { id: packageId },
    });
    if (!existingPackage) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Package not found");
    }
    if (existingPackage.agencyId !== agencyId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You do not have permission to edit this package");
    }
    // 2. Handle Image Update (Check if the incoming image is a new Base64 string)
    let imageUrl = existingPackage.images[0];
    if (payload.images &&
        payload.images.length > 0 &&
        payload.images[0].startsWith("data:image")) {
        const uploadedImage = await (0, cloudinary_1.uploadToCloudinary)(payload.images[0]);
        if (!uploadedImage) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Image upload failed. Please try again.");
        }
        imageUrl = uploadedImage.secure_url;
    }
    // 3. Update the package
    const updatedPackage = await prisma_1.prisma.package.update({
        where: { id: packageId },
        data: {
            title: payload.title !== undefined ? payload.title : existingPackage.title,
            description: payload.description !== undefined
                ? payload.description
                : existingPackage.description,
            price: payload.price !== undefined ? payload.price : existingPackage.price,
            maxCapacity: payload.maxCapacity !== undefined
                ? payload.maxCapacity
                : existingPackage.maxCapacity,
            destination: payload.destination !== undefined
                ? payload.destination
                : existingPackage.destination,
            lastBookingDay: payload.lastBookingDay
                ? new Date(payload.lastBookingDay)
                : existingPackage.lastBookingDay,
            availableDates: payload.availableDates
                ? payload.availableDates.map((d) => new Date(d))
                : existingPackage.availableDates,
            amenities: payload.amenities !== undefined
                ? payload.amenities
                : existingPackage.amenities,
            itinerary: payload.itinerary !== undefined
                ? payload.itinerary
                : existingPackage.itinerary,
            images: [imageUrl],
        },
    });
    return updatedPackage;
};
const deletePackageFromDB = async (id, user) => {
    const pkg = await prisma_1.prisma.package.findUnique({ where: { id } });
    if (!pkg) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Package not found");
    }
    if (pkg.agencyId !== user.userId && user.role !== "ADMIN") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to delete this package");
    }
    const result = await prisma_1.prisma.package.delete({ where: { id } });
    return result;
};
exports.PackageService = {
    createPackage,
    getAllPackagesFromDB,
    getMyAgencyPackagesFromDB,
    getPackageByIdFromDB,
    updatePackageIntoDB: updatePackage,
    deletePackageFromDB,
};
