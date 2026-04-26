"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("../../../generated/prisma/client");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../lib/prisma");
const createBookingIntoDB = async (payload, user) => {
    return await prisma_1.prisma.$transaction(async (tx) => {
        // 1. Fetch package
        const pkg = await tx.package.findUnique({
            where: { id: payload.packageId },
        });
        if (!pkg) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Package not found");
        }
        // 2. Check active
        if (!pkg.isActive) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Package is not active");
        }
        // 3. Check slots availability
        // Assuming maxCapacity acts as the remaining available slots
        if (pkg.maxCapacity < payload.numberOfTravelers) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Not enough slots available for this package");
        }
        // 4. Date Verification (basic day validation)
        const selectedDateObj = new Date(payload.selectedDate);
        const isDateAvailable = pkg.availableDates.some((availDate) => availDate.toISOString().split("T")[0] ===
            selectedDateObj.toISOString().split("T")[0]);
        if (!isDateAvailable) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "The selected date is not available in the package itinerary dates");
        }
        // 5. Lock total price
        const lockedTotalPrice = pkg.price * payload.numberOfTravelers;
        // 6. Create booking
        const newBooking = await tx.booking.create({
            data: {
                travelerId: user.userId,
                packageId: payload.packageId,
                selectedDate: selectedDateObj,
                numberOfTravelers: payload.numberOfTravelers,
                seats: payload.numberOfTravelers,
                totalPrice: lockedTotalPrice,
                status: client_1.BookingStatus.PENDING,
            },
            include: {
                package: true,
            },
        });
        // 7. Decrement available slots from the package (PRD Business Rule #7)
        await tx.package.update({
            where: { id: payload.packageId },
            data: {
                maxCapacity: {
                    decrement: payload.numberOfTravelers, // Subtracts the booked seats from the package capacity
                },
            },
        });
        return newBooking;
    });
};
const getAllBookingsFromDB = async (query) => {
    const { page = 1, limit = 10, status } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const bookings = await prisma_1.prisma.booking.findMany({
        where: status ? { status: status.toUpperCase() } : {},
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
            traveler: { select: { id: true, name: true, email: true } },
            package: {
                select: {
                    id: true,
                    title: true,
                    maxCapacity: true,
                    agency: {
                        select: { id: true, name: true, email: true, agencyName: true },
                    },
                },
            },
        },
    });
    const total = await prisma_1.prisma.booking.count({
        where: status ? { status: status.toUpperCase() } : {},
    });
    return {
        meta: { page: Number(page), limit: Number(limit), total },
        data: bookings,
    };
};
const getMyBookingsFromDB = async (user, query) => {
    const { page = 1, limit = 10, status } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const whereConditions = {
        travelerId: user.userId,
        ...(status && {
            status: status.toUpperCase(),
        }),
    };
    const bookings = await prisma_1.prisma.booking.findMany({
        where: whereConditions,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
            package: {
                select: {
                    id: true,
                    title: true,
                    images: true,
                    destination: true,
                    agency: {
                        select: { id: true, name: true, profileImage: true, email: true },
                    },
                },
            },
        },
    });
    const total = await prisma_1.prisma.booking.count({
        where: whereConditions,
    });
    return {
        meta: { page: Number(page), limit: Number(limit), total },
        data: bookings,
    };
};
const getAgencyBookingsFromDB = async (user, query) => {
    const { page = 1, limit = 10, searchTerm, status } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const andConditions = [
        { package: { agencyId: user.userId } },
    ];
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    traveler: {
                        name: { contains: searchTerm, mode: "insensitive" },
                    },
                },
                {
                    traveler: {
                        email: { contains: searchTerm, mode: "insensitive" },
                    },
                },
                {
                    package: {
                        title: { contains: searchTerm, mode: "insensitive" },
                    },
                },
            ],
        });
    }
    if (status) {
        andConditions.push({
            status: status.toUpperCase(),
        });
    }
    const whereConditions = {
        AND: andConditions,
    };
    const bookings = await prisma_1.prisma.booking.findMany({
        where: whereConditions,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
            traveler: {
                select: { id: true, name: true, email: true, profileImage: true },
            },
            package: {
                select: {
                    id: true,
                    title: true,
                    maxCapacity: true,
                    price: true,
                    destination: true,
                },
            },
        },
    });
    const total = await prisma_1.prisma.booking.count({
        where: whereConditions,
    });
    return {
        meta: { page: Number(page), limit: Number(limit), total },
        data: bookings,
    };
};
const getBookingByIdFromDB = async (id, user) => {
    const booking = await prisma_1.prisma.booking.findUnique({
        where: { id },
        include: {
            package: true,
            traveler: {
                select: { id: true, name: true, profileImage: true, email: true },
            },
        },
    });
    if (!booking)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
    // Verify access privileges
    if (user.role === "TRAVELER" && booking.travelerId !== user.userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Information belongs to another traveler");
    }
    if (user.role === "AGENCY" && booking.package.agencyId !== user.userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Information belongs to another agency pipeline");
    }
    return booking;
};
const updateBookingStatusIntoDB = async (id, status, user) => {
    return await prisma_1.prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUnique({
            where: { id },
            include: { package: true },
        });
        if (!booking)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
        if (user.role === "AGENCY" && booking.package.agencyId !== user.userId) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Unauthorized to alter this booking");
        }
        if (booking.status === status) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Booking is already ${status}`);
        }
        const updatedBooking = await tx.booking.update({
            where: { id },
            data: { status },
        });
        // If new status is CANCELLED, restore slot count
        if (status === client_1.BookingStatus.CANCELLED &&
            booking.status !== client_1.BookingStatus.CANCELLED) {
            await tx.package.update({
                where: { id: booking.packageId },
                data: {
                    maxCapacity: booking.package.maxCapacity + booking.numberOfTravelers,
                },
            });
        }
        // Conversely, if previously CANCELLED and now restoring to another status, reduce slots again
        if (booking.status === client_1.BookingStatus.CANCELLED &&
            status !== client_1.BookingStatus.CANCELLED) {
            // Check if restoring capacity is possible
            if (booking.package.maxCapacity < booking.numberOfTravelers) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Not enough package slots left to restore booking");
            }
            await tx.package.update({
                where: { id: booking.packageId },
                data: {
                    maxCapacity: booking.package.maxCapacity - booking.numberOfTravelers,
                },
            });
        }
        return updatedBooking;
    });
};
const cancelBookingFromDB = async (id, user) => {
    return await prisma_1.prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUnique({
            where: { id },
            include: { package: true },
        });
        if (!booking)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
        if (user.role === "TRAVELER" && booking.travelerId !== user.userId) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You cannot cancel someone else's booking");
        }
        if (booking.status === client_1.BookingStatus.CANCELLED) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Booking is already cancelled");
        }
        const cancelledBooking = await tx.booking.update({
            where: { id },
            data: { status: client_1.BookingStatus.CANCELLED },
        });
        // Restore slot capacity
        await tx.package.update({
            where: { id: booking.packageId },
            data: {
                maxCapacity: booking.package.maxCapacity + booking.numberOfTravelers,
            },
        });
        return cancelledBooking;
    });
};
exports.BookingService = {
    createBookingIntoDB,
    getAllBookingsFromDB,
    getMyBookingsFromDB,
    getAgencyBookingsFromDB,
    getBookingByIdFromDB,
    updateBookingStatusIntoDB,
    cancelBookingFromDB,
};
