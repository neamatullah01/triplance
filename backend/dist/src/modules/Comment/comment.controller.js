"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const comment_service_1 = require("./comment.service");
const addComment = (0, catchAsync_1.default)(async (req, res) => {
    const postId = req.params.postId;
    const result = await comment_service_1.CommentService.addComment(postId, req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Comment added successfully',
        data: result,
    });
});
const getCommentsByPost = (0, catchAsync_1.default)(async (req, res) => {
    const postId = req.params.postId;
    const result = await comment_service_1.CommentService.getCommentsByPost(postId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comments retrieved successfully',
        data: result,
    });
});
const deleteComment = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await comment_service_1.CommentService.deleteComment(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment deleted successfully',
        data: result,
    });
});
exports.CommentController = {
    addComment,
    getCommentsByPost,
    deleteComment,
};
