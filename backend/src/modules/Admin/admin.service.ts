import { PaymentStatus } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

const getPlatformStatsFromDB = async () => {
  const totalUsers = await prisma.user.count();
  const totalBookings = await prisma.booking.count();
  
  const revenueResult = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: PaymentStatus.PAID }
  });
  const totalRevenue = revenueResult._sum.amount || 0;

  const newAgenciesPendingApproval = await prisma.user.count({
    where: { role: 'AGENCY', isVerified: false }
  });

  return {
    totalUsers,
    totalBookings,
    totalRevenue,
    newAgenciesPendingApproval
  };
};

export const AdminService = {
  getPlatformStatsFromDB,
};
