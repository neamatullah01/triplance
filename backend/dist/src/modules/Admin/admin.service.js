"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const client_1 = require("../../../generated/prisma/client");
const prisma_1 = require("../../lib/prisma");
const getPlatformStatsFromDB = async () => {
    const totalUsers = await prisma_1.prisma.user.count();
    const totalBookings = await prisma_1.prisma.booking.count();
    const revenueResult = await prisma_1.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: client_1.PaymentStatus.PAID }
    });
    const totalRevenue = revenueResult._sum.amount || 0;
    const newAgenciesPendingApproval = await prisma_1.prisma.user.count({
        where: { role: 'AGENCY', isVerified: false }
    });
    return {
        totalUsers,
        totalBookings,
        totalRevenue,
        newAgenciesPendingApproval
    };
};
exports.AdminService = {
    getPlatformStatsFromDB,
};
