"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../lib/prisma");
const followUser = async (followingId, user) => {
    const followerId = user.userId;
    if (followerId === followingId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You cannot follow yourself');
    }
    // Check if following user exists
    const userToFollow = await prisma_1.prisma.user.findUnique({
        where: { id: followingId }
    });
    if (!userToFollow) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Check unique constraint manually for better error message
    const existingFollow = await prisma_1.prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId,
                followingId,
            }
        }
    });
    if (existingFollow) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'You are already following this user');
    }
    const result = await prisma_1.prisma.follow.create({
        data: {
            followerId,
            followingId,
        }
    });
    return result;
};
const unfollowUser = async (followingId, user) => {
    const followerId = user.userId;
    const existingFollow = await prisma_1.prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId,
                followingId,
            }
        }
    });
    if (!existingFollow) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'You are not following this user');
    }
    const result = await prisma_1.prisma.follow.delete({
        where: {
            id: existingFollow.id
        }
    });
    return result;
};
const getFollowers = async (id) => {
    // Check if user exists
    const user = await prisma_1.prisma.user.findUnique({
        where: { id }
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const followers = await prisma_1.prisma.follow.findMany({
        where: { followingId: id },
        include: {
            follower: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                    role: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    return followers;
};
const getFollowing = async (id) => {
    // Check if user exists
    const user = await prisma_1.prisma.user.findUnique({
        where: { id }
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const following = await prisma_1.prisma.follow.findMany({
        where: { followerId: id },
        include: {
            following: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                    role: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    return following;
};
exports.FollowService = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
};
