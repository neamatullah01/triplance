"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../lib/prisma");
const createReviewIntoDB = async (payload, user) => {
    return await prisma_1.prisma.$transaction(async (tx) => {
        // 1. Fetch booking
        const booking = await tx.booking.findUnique({
            where: { id: payload.bookingId },
            include: { package: true },
        });
        if (!booking) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
        }
        if (booking.travelerId !== user.userId) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You can only review your own bookings");
        }
        if (booking.status !== "COMPLETED") {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You can only review after the trip is completely finished");
        }
        // 2. Check if review already exists
        const existingReview = await tx.review.findUnique({
            where: { bookingId: booking.id },
        });
        if (existingReview) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "A review already exists for this booking");
        }
        // 3. Create review
        const newReview = await tx.review.create({
            data: {
                rating: payload.rating,
                comment: payload.comment,
                bookingId: booking.id,
                packageId: booking.packageId,
                agencyId: booking.package.agencyId,
                travelerId: user.userId,
            },
        });
        // 4. Recalculate package rating
        const packageReviews = await tx.review.aggregate({
            where: { packageId: booking.packageId },
            _avg: { rating: true },
        });
        await tx.package.update({
            where: { id: booking.packageId },
            data: { rating: packageReviews._avg.rating || 0 },
        });
        // 5. Recalculate agency rating
        const agencyReviews = await tx.review.aggregate({
            where: { agencyId: booking.package.agencyId },
            _avg: { rating: true },
        });
        await tx.user.update({
            where: { id: booking.package.agencyId },
            data: { rating: agencyReviews._avg.rating || 0 },
        });
        return newReview;
    });
};
const getAllReviewsFromDB = async (query) => {
    const { page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const reviews = await prisma_1.prisma.review.findMany({
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
            traveler: { select: { id: true, name: true, profileImage: true } },
            package: { select: { id: true, title: true } },
            agency: { select: { id: true, name: true } },
        },
    });
    const total = await prisma_1.prisma.review.count();
    return {
        meta: { page: Number(page), limit: Number(limit), total },
        data: reviews,
    };
};
const getReviewsForPackageFromDB = async (packageId, query) => {
    const { page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const reviews = await prisma_1.prisma.review.findMany({
        where: { packageId },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
            traveler: { select: { id: true, name: true, profileImage: true } },
        },
    });
    const total = await prisma_1.prisma.review.count({ where: { packageId } });
    return {
        meta: { page: Number(page), limit: Number(limit), total },
        data: reviews,
    };
};
const getReviewByBookingAndUserFromDB = async (bookingId, user) => {
    // bookingId is a unique key on Review — single index lookup, no scan
    const review = await prisma_1.prisma.review.findUnique({
        where: { bookingId },
        include: {
            traveler: { select: { id: true, name: true, profileImage: true } },
            package: { select: { id: true, title: true } },
            agency: { select: { id: true, name: true } },
        },
    });
    if (!review) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No review found for this booking");
    }
    if (review.travelerId !== user.userId && user.role !== "ADMIN") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This review does not belong to you");
    }
    return review;
};
const deleteReviewFromDB = async (id, user) => {
    return await prisma_1.prisma.$transaction(async (tx) => {
        const review = await tx.review.findUnique({
            where: { id },
        });
        if (!review) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found");
        }
        if (review.travelerId !== user.userId && user.role !== "ADMIN") {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Unauthorized to delete this review");
        }
        const deletedReview = await tx.review.delete({
            where: { id },
        });
        // Recalculate package rating
        const packageReviews = await tx.review.aggregate({
            where: { packageId: review.packageId },
            _avg: { rating: true },
        });
        await tx.package.update({
            where: { id: review.packageId },
            data: { rating: packageReviews._avg.rating || 0 },
        });
        // Recalculate agency rating
        const agencyReviews = await tx.review.aggregate({
            where: { agencyId: review.agencyId },
            _avg: { rating: true },
        });
        await tx.user.update({
            where: { id: review.agencyId },
            data: { rating: agencyReviews._avg.rating || 0 },
        });
        return deletedReview;
    });
};
exports.ReviewService = {
    createReviewIntoDB,
    getAllReviewsFromDB,
    getReviewsForPackageFromDB,
    getReviewByBookingAndUserFromDB,
    deleteReviewFromDB,
};
