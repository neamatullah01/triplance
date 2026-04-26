"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const cloudinary_1 = require("../../utils/cloudinary");
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.getAllUsers(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getUserById = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await user_service_1.UserService.getUserById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});
const updateProfile = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    // Cast req to any to bypass strict type checking for req.user
    const authUser = req.user;
    // 1. Get the payload from the standard JSON body
    let payload = { ...req.body };
    // 2. Check if the profileImage is a Base64 string and upload it
    if (payload.profileImage && payload.profileImage.startsWith('data:image')) {
        const profileUpload = await (0, cloudinary_1.uploadToCloudinary)(payload.profileImage);
        if (profileUpload?.secure_url) {
            payload.profileImage = profileUpload.secure_url;
        }
    }
    // 3. Check if the coverImage is a Base64 string and upload it
    if (payload.coverImage && payload.coverImage.startsWith('data:image')) {
        const coverUpload = await (0, cloudinary_1.uploadToCloudinary)(payload.coverImage);
        if (coverUpload?.secure_url) {
            payload.coverImage = coverUpload.secure_url;
        }
    }
    // 4. Pass the clean payload with Cloudinary URLs to your database
    const result = await user_service_1.UserService.updateProfile(id, payload, authUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
});
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await user_service_1.UserService.deleteUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User deleted successfully',
        data: result,
    });
});
const banUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await user_service_1.UserService.banUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User ban status updated successfully',
        data: result,
    });
});
const approveAgency = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await user_service_1.UserService.approveAgency(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Agency approval status updated successfully',
        data: result,
    });
});
const getSuggestedUsers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.getSuggestedUsers(req.user, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Suggested users retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getAllAgenciesForUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.getAllAgenciesForUser(req.user, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Agencies retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
exports.UserController = {
    getAllUsers,
    getUserById,
    updateProfile,
    deleteUser,
    banUser,
    approveAgency,
    getSuggestedUsers,
    getAllAgenciesForUser,
};
