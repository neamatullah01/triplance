"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const post_service_1 = require("./post.service");
const createPost = (0, catchAsync_1.default)(async (req, res) => {
    const result = await post_service_1.PostService.createPost(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Post created successfully',
        data: result,
    });
});
const getAllPosts = (0, catchAsync_1.default)(async (req, res) => {
    const result = await post_service_1.PostService.getAllPosts(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Posts retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getAllFeedPost = (0, catchAsync_1.default)(async (req, res) => {
    const result = await post_service_1.PostService.getAllFeedPost(req.user, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Feed retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getPostById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await post_service_1.PostService.getPostById(req.user, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User posts retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const updatePost = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await post_service_1.PostService.updatePost(id, req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Post updated successfully',
        data: result,
    });
});
const deletePost = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await post_service_1.PostService.deletePost(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Post deleted successfully',
        data: result,
    });
});
exports.PostController = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getAllFeedPost,
};
