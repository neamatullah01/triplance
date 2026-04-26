"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const follow_service_1 = require("./follow.service");
const followUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await follow_service_1.FollowService.followUser(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User followed successfully',
        data: result,
    });
});
const unfollowUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await follow_service_1.FollowService.unfollowUser(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User unfollowed successfully',
        data: result,
    });
});
const getFollowers = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await follow_service_1.FollowService.getFollowers(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Followers retrieved successfully',
        data: result,
    });
});
const getFollowing = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await follow_service_1.FollowService.getFollowing(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Following retrieved successfully',
        data: result,
    });
});
exports.FollowController = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
};
