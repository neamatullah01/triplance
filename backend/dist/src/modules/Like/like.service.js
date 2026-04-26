"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../lib/prisma");
const likePost = async (postId, user) => {
    const post = await prisma_1.prisma.post.findUnique({
        where: { id: postId },
    });
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    }
    const existingLike = await prisma_1.prisma.like.findUnique({
        where: {
            userId_postId: {
                userId: user.userId,
                postId,
            }
        }
    });
    if (existingLike) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'You have already liked this post');
    }
    const result = await prisma_1.prisma.like.create({
        data: {
            userId: user.userId,
            postId,
        },
    });
    return result;
};
const unlikePost = async (postId, user) => {
    const existingLike = await prisma_1.prisma.like.findUnique({
        where: {
            userId_postId: {
                userId: user.userId,
                postId,
            }
        }
    });
    if (!existingLike) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Like not found');
    }
    const result = await prisma_1.prisma.like.delete({
        where: {
            id: existingLike.id,
        },
    });
    return result;
};
exports.LikeService = {
    likePost,
    unlikePost,
};
