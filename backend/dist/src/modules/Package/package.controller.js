"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const package_service_1 = require("./package.service");
const createPackage = (0, catchAsync_1.default)(async (req, res) => {
    const agencyId = req.user.userId;
    // Pass the entire JSON body to the service
    const result = await package_service_1.PackageService.createPackage(agencyId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Package created successfully",
        data: result,
    });
});
const getAllPackages = (0, catchAsync_1.default)(async (req, res) => {
    const result = await package_service_1.PackageService.getAllPackagesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Packages retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getMyAgencyPackages = (0, catchAsync_1.default)(async (req, res) => {
    const result = await package_service_1.PackageService.getMyAgencyPackagesFromDB(req.user, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Agency packages retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getPackageById = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await package_service_1.PackageService.getPackageByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Package retrieved successfully",
        data: result,
    });
});
const updatePackage = (0, catchAsync_1.default)(async (req, res) => {
    const agencyId = req.user.userId;
    const packageId = req.params.id;
    const payload = req.body;
    const result = await package_service_1.PackageService.updatePackageIntoDB(agencyId, packageId, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Package updated successfully",
        data: result,
    });
});
const deletePackage = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await package_service_1.PackageService.deletePackageFromDB(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Package deleted successfully",
        data: result,
    });
});
exports.PackageController = {
    createPackage,
    getAllPackages,
    getMyAgencyPackages,
    getPackageById,
    updatePackage,
    deletePackage,
};
