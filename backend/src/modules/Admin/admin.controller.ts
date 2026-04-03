import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';

const getPlatformStats = catchAsync(async (req, res) => {
  const result = await AdminService.getPlatformStatsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Platform statistics retrieved successfully',
    data: result,
  });
});

export const AdminController = {
  getPlatformStats,
};
