"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const agency_service_1 = require("./agency.service");
const getDashboardStats = (0, catchAsync_1.default)(async (req, res) => {
    const agencyId = req.user.userId; // Extracted from JWT auth middleware
    const result = await agency_service_1.AgencyService.getAgencyDashboardStats(agencyId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Agency dashboard stats retrieved successfully",
        data: result,
    });
});
exports.AgencyController = {
    getDashboardStats,
};
