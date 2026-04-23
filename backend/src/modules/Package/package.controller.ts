import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PackageService } from "./package.service";

const createPackage = catchAsync(async (req, res) => {
  const agencyId = req.user.userId;

  // Pass the entire JSON body to the service
  const result = await PackageService.createPackage(agencyId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Package created successfully",
    data: result,
  });
});

const getAllPackages = catchAsync(async (req, res) => {
  const result = await PackageService.getAllPackagesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Packages retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMyAgencyPackages = catchAsync(async (req, res) => {
  const result = await PackageService.getMyAgencyPackagesFromDB(
    req.user,
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agency packages retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getPackageById = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await PackageService.getPackageByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Package retrieved successfully",
    data: result,
  });
});

const updatePackage = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await PackageService.updatePackageIntoDB(
    id,
    req.body,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Package updated successfully",
    data: result,
  });
});

const deletePackage = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await PackageService.deletePackageFromDB(id, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Package deleted successfully",
    data: result,
  });
});

export const PackageController = {
  createPackage,
  getAllPackages,
  getMyAgencyPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
