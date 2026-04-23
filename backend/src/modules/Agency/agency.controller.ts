import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AgencyService } from "./agency.service";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const agencyId = req.user.userId; // Extracted from JWT auth middleware

  const result = await AgencyService.getAgencyDashboardStats(agencyId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Agency dashboard stats retrieved successfully",
    data: result,
  });
});

export const AgencyController = {
  getDashboardStats,
};
