"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../lib/prisma");
const addComment = async (postId, payload, user) => {
    const post = await prisma_1.prisma.post.findUnique({
        where: { id: postId },
    });
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    }
    const result = await prisma_1.prisma.comment.create({
        data: {
            text: payload.text,
            postId,
            userId: user.userId,
            parentId: payload.parentId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                }
            }
        }
    });
    return result;
};
const getCommentsByPost = async (postId) => {
    const comments = await prisma_1.prisma.comment.findMany({
        where: { postId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                }
            }
        },
        orderBy: { createdAt: 'asc' },
    });
    return comments;
};
const deleteComment = async (id, user) => {
    const comment = await prisma_1.prisma.comment.findUnique({
        where: { id },
    });
    if (!comment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found');
    }
    if (comment.userId !== user.userId && user.role !== 'ADMIN') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to delete this comment');
    }
    const result = await prisma_1.prisma.comment.delete({
        where: { id },
    });
    return result;
};
exports.CommentService = {
    addComment,
    getCommentsByPost,
    deleteComment,
};
