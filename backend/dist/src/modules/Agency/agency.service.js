"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../lib/prisma");
const getAgencyDashboardStats = async (agencyId) => {
    // 1. Verify user is an approved agency
    const agency = await prisma_1.prisma.user.findUnique({
        where: { id: agencyId, role: "AGENCY" },
    });
    if (!agency) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Agency not found");
    }
    // 2. Aggregate Total Revenue (Only 'paid' status)
    const revenueAggregation = await prisma_1.prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
            status: "PAID", // Based on PRD payment statuses
            booking: {
                package: {
                    agencyId: agencyId,
                },
            },
        },
    });
    const totalRevenue = revenueAggregation._sum.amount || 0;
    // 3. Count Total Bookings
    const totalBookings = await prisma_1.prisma.booking.count({
        where: {
            package: { agencyId: agencyId },
        },
    });
    // 4. Count Active Packages
    const activePackages = await prisma_1.prisma.package.count({
        where: {
            agencyId: agencyId,
            isActive: true, // Based on PRD package properties
        },
    });
    // 5. Get Recent Bookings (Limit to 5)
    const recentBookings = await prisma_1.prisma.booking.findMany({
        where: {
            package: { agencyId: agencyId },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
            traveler: { select: { name: true, profileImage: true } }, // Traveler details
            package: { select: { title: true } },
            payment: { select: { amount: true, status: true } },
        },
    });
    return {
        stats: {
            totalRevenue,
            totalBookings,
            activePackages,
            avgRating: agency.rating || 0, // From User model rating property
        },
        recentBookings: recentBookings.map((b) => ({
            id: b.id,
            travelerName: b.traveler.name,
            packageName: b.package.title,
            status: b.status,
            date: b.createdAt,
            amount: b.payment?.amount || b.totalPrice,
        })),
    };
};
exports.AgencyService = {
    getAgencyDashboardStats,
};
