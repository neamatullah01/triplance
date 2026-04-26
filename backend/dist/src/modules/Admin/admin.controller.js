"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const admin_service_1 = require("./admin.service");
const getPlatformStats = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.AdminService.getPlatformStatsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Platform statistics retrieved successfully',
        data: result,
    });
});
exports.AdminController = {
    getPlatformStats,
};
