"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../lib/prisma");
const createPost = async (payload, user) => {
    const result = await prisma_1.prisma.post.create({
        data: {
            ...payload,
            authorId: user.userId,
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                    role: true,
                }
            }
        }
    });
    return result;
};
const getAllPosts = async (query) => {
    const { page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const posts = await prisma_1.prisma.post.findMany({
        skip,
        take: Number(limit),
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                    role: true,
                }
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' },
    });
    const total = await prisma_1.prisma.post.count();
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: posts,
    };
};
const getPostById = async (user, query) => {
    const { page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const posts = await prisma_1.prisma.post.findMany({
        where: { authorId: user.userId },
        skip,
        take: Number(limit),
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                    role: true,
                }
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                }
            },
            likes: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true,
                        }
                    }
                }
            },
            comments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    const total = await prisma_1.prisma.post.count({ where: { authorId: user.userId } });
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: posts,
    };
};
const updatePost = async (id, payload, user) => {
    const post = await prisma_1.prisma.post.findUnique({
        where: { id },
    });
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    }
    if (post.authorId !== user.userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to update this post');
    }
    const result = await prisma_1.prisma.post.update({
        where: { id },
        data: payload,
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                    role: true,
                }
            }
        }
    });
    return result;
};
const deletePost = async (id, user) => {
    const post = await prisma_1.prisma.post.findUnique({
        where: { id },
    });
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found');
    }
    if (post.authorId !== user.userId && user.role !== 'ADMIN') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to delete this post');
    }
    const result = await prisma_1.prisma.post.delete({
        where: { id },
    });
    return result;
};
const getAllFeedPost = async (user, query) => {
    const { page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    // 1. Get the list of users and agencies the current user is following
    const following = await prisma_1.prisma.follow.findMany({
        where: { followerId: user.userId },
        select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);
    // 2. Fetch posts from following users & agencies & the user themselves
    // Since both TRAVELER and AGENCY roles are users, followingIds covers both
    const targetUserIds = [...followingIds, user.userId];
    const postsWhereClause = {
        authorId: { in: targetUserIds },
    };
    const posts = await prisma_1.prisma.post.findMany({
        where: postsWhereClause,
        orderBy: { createdAt: 'desc' },
        take: skip + take, // Fetch up to the needed items to ensure correct offset sorting
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                    role: true,
                },
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                },
            },
            likes: {
                where: {
                    userId: user.userId
                },
                select: {
                    id: true
                }
            }
        },
    });
    // 3. Fetch packages (all agency packages)
    const packages = await prisma_1.prisma.package.findMany({
        orderBy: { createdAt: 'desc' },
        take: skip + take,
        include: {
            agency: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                    role: true,
                },
            },
            _count: {
                select: {
                    reviews: true,
                },
            },
        },
    });
    // 4. Transform and merge into a common Feed entity
    const formattedPosts = posts.map((post) => ({
        ...post,
        feedType: 'POST', // distinguish feed item type
    }));
    const formattedPackages = packages.map((pkg) => ({
        id: pkg.id,
        content: `${pkg.title}\n\n${pkg.description}`,
        images: pkg.images,
        location: pkg.destination,
        tags: pkg.amenities,
        createdAt: pkg.createdAt,
        updatedAt: pkg.updatedAt,
        authorId: pkg.agencyId,
        author: pkg.agency,
        feedType: 'PACKAGE',
        packageDetails: pkg, // Provide original package data
        _count: {
            likes: 0,
            comments: pkg._count.reviews,
        },
    }));
    // 5. Sort by createdAt descending
    const mergedFeed = [...formattedPosts, ...formattedPackages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    // 6. Apply pagination slice
    const paginatedFeed = mergedFeed.slice(skip, skip + take);
    // Compute total elements for pagination metadata
    const totalPosts = await prisma_1.prisma.post.count({ where: postsWhereClause });
    const totalPackages = await prisma_1.prisma.package.count();
    const total = totalPosts + totalPackages;
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: paginatedFeed,
    };
};
exports.PostService = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getAllFeedPost,
};
