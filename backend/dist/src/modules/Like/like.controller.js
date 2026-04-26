"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const like_service_1 = require("./like.service");
const likePost = (0, catchAsync_1.default)(async (req, res) => {
    const postId = req.params.postId;
    const result = await like_service_1.LikeService.likePost(postId, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Post liked successfully',
        data: result,
    });
});
const unlikePost = (0, catchAsync_1.default)(async (req, res) => {
    const postId = req.params.postId;
    const result = await like_service_1.LikeService.unlikePost(postId, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Post unliked successfully',
        data: result,
    });
});
exports.LikeController = {
    likePost,
    unlikePost,
};
