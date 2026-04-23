import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";

const getAgencyDashboardStats = async (agencyId: string) => {
  // 1. Verify user is an approved agency
  const agency = await prisma.user.findUnique({
    where: { id: agencyId, role: "AGENCY" },
  });

  if (!agency) {
    throw new AppError(httpStatus.NOT_FOUND, "Agency not found");
  }

  // 2. Aggregate Total Revenue (Only 'paid' status)
  const revenueAggregation = await prisma.payment.aggregate({
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
  const totalBookings = await prisma.booking.count({
    where: {
      package: { agencyId: agencyId },
    },
  });

  // 4. Count Active Packages
  const activePackages = await prisma.package.count({
    where: {
      agencyId: agencyId,
      isActive: true, // Based on PRD package properties
    },
  });

  // 5. Get Recent Bookings (Limit to 5)
  const recentBookings = await prisma.booking.findMany({
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

export const AgencyService = {
  getAgencyDashboardStats,
};
