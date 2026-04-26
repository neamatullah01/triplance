"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../lib/prisma");
const getAllUsers = async (query) => {
    const { page = 1, limit = 10, role, isVerified, tab } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const whereConditions = {};
    // 1. Handle Role Filtering
    if (role) {
        whereConditions.role = role.toUpperCase();
    }
    else {
        whereConditions.role = { not: "ADMIN" };
    }
    // 2. Handle Verification Filter
    if (isVerified !== undefined) {
        whereConditions.isVerified = isVerified === "true" || isVerified === true;
    }
    // 3. Handle Tab Logic (Banned vs Active)
    if (tab === "banned") {
        // Show ONLY banned users
        whereConditions.isBanned = true;
    }
    const users = await prisma_1.prisma.user.findMany({
        where: whereConditions,
        skip,
        take: Number(limit),
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profileImage: true,
            bio: true,
            rating: true,
            isVerified: true,
            isBanned: true,
            createdAt: true,
            _count: {
                select: {
                    packages: true,
                    bookings: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    const total = await prisma_1.prisma.user.count({ where: whereConditions });
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: users,
    };
};
const getUserById = async (id) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profileImage: true,
            coverImage: true,
            bio: true,
            agencyName: true,
            website: true,
            rating: true,
            isVerified: true,
            isBanned: true,
            createdAt: true,
            _count: {
                select: {
                    followers: true,
                    following: true,
                    packages: true,
                    posts: true,
                    reviewsReceived: true,
                },
            },
            posts: {
                orderBy: { createdAt: "desc" },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true,
                            isVerified: true,
                        },
                    },
                    _count: { select: { likes: true, comments: true } },
                },
            },
            packages: {
                orderBy: { createdAt: "desc" },
            },
            reviewsReceived: {
                orderBy: { createdAt: "desc" },
                include: {
                    traveler: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true,
                        },
                    },
                },
            },
            followers: true,
            following: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return user;
};
const updateProfile = async (id, payload, authUser) => {
    if (authUser.role !== "ADMIN" && authUser.userId !== id) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to update this profile");
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { id },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const updatedUser = await prisma_1.prisma.user.update({
        where: { id },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profileImage: true,
            coverImage: true,
            bio: true,
            agencyName: true,
            website: true,
        },
    });
    return updatedUser;
};
const deleteUser = async (id) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const deletedUser = await prisma_1.prisma.user.delete({
        where: { id },
    });
    return deletedUser;
};
const banUser = async (id) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const updatedUser = await prisma_1.prisma.user.update({
        where: { id },
        data: {
            isBanned: !user.isBanned,
        },
        select: {
            id: true,
            email: true,
            name: true,
            isBanned: true,
        },
    });
    return updatedUser;
};
const approveAgency = async (id) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (user.role !== "AGENCY") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Only agencies can be approved");
    }
    const updatedUser = await prisma_1.prisma.user.update({
        where: { id },
        data: {
            isVerified: true,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isVerified: true,
        },
    });
    return updatedUser;
};
const getSuggestedUsers = async (authUser, query) => {
    const { page = 1, limit = 10, search } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    // 1. Get all IDs the current user already follows
    const alreadyFollowing = await prisma_1.prisma.follow.findMany({
        where: { followerId: authUser.userId },
        select: { followingId: true },
    });
    const followingIds = alreadyFollowing.map((f) => f.followingId);
    // IDs to exclude: own account + already-followed users
    const excludeIds = [...followingIds, authUser.userId];
    // 2. Build search filter
    const searchFilter = search
        ? {
            OR: [
                {
                    name: { contains: search, mode: "insensitive" },
                },
                { bio: { contains: search, mode: "insensitive" } },
            ],
        }
        : {};
    // 3. Try: find TRAVELER followers-of-followers (people your followees follow)
    let suggested = [];
    if (followingIds.length > 0) {
        // Get all users followed by the people I follow
        const followersOfFollowees = await prisma_1.prisma.follow.findMany({
            where: {
                followerId: { in: followingIds },
                followingId: { notIn: excludeIds },
            },
            select: { followingId: true },
            distinct: ["followingId"],
            take: skip + take,
        });
        const candidateIds = followersOfFollowees.map((f) => f.followingId);
        if (candidateIds.length > 0) {
            suggested = await prisma_1.prisma.user.findMany({
                where: {
                    id: { in: candidateIds },
                    isBanned: false,
                    ...searchFilter,
                },
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                    bio: true,
                    role: true,
                    isVerified: true,
                    _count: { select: { followers: true, posts: true } },
                },
                skip,
                take,
            });
        }
    }
    // 4. Fallback: if no network-based suggestions, show all TRAVELERs (excluding self and already-following)
    if (suggested.length === 0) {
        suggested = await prisma_1.prisma.user.findMany({
            where: {
                id: { notIn: excludeIds },
                role: "TRAVELER",
                isBanned: false,
                ...searchFilter,
            },
            select: {
                id: true,
                name: true,
                profileImage: true,
                bio: true,
                role: true,
                isVerified: true,
                _count: { select: { followers: true, posts: true } },
            },
            orderBy: { followers: { _count: "desc" } },
            skip,
            take,
        });
    }
    // 5. Compute total for pagination metadata
    const total = await prisma_1.prisma.user.count({
        where: {
            id: { notIn: excludeIds },
            isBanned: false,
            ...searchFilter,
        },
    });
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: suggested,
    };
};
const getAllAgenciesForUser = async (authUser, query) => {
    const { page = 1, limit = 10, search } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const baseWhere = {
        role: "AGENCY",
        isBanned: false,
        isVerified: true,
        ...(search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        bio: { contains: search, mode: "insensitive" },
                    },
                    {
                        agencyName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : {}),
    };
    const unfollowedWhere = {
        ...baseWhere,
        followers: { none: { followerId: authUser.userId } },
    };
    const followedWhere = {
        ...baseWhere,
        followers: { some: { followerId: authUser.userId } },
    };
    const totalUnfollowed = await prisma_1.prisma.user.count({ where: unfollowedWhere });
    const totalFollowed = await prisma_1.prisma.user.count({ where: followedWhere });
    const total = totalUnfollowed + totalFollowed;
    let mappedAgencies = [];
    const selectFields = {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        coverImage: true, // Need this if you have it in DB, if not remove. Wait! Schema check
        bio: true,
        rating: true,
        isVerified: true,
        createdAt: true,
        _count: {
            select: {
                followers: true,
                packages: true,
            },
        },
    };
    if (skip < totalUnfollowed) {
        const unfollowedAgencies = await prisma_1.prisma.user.findMany({
            where: unfollowedWhere,
            skip,
            take,
            select: selectFields,
            orderBy: { createdAt: "desc" },
        });
        mappedAgencies = [
            ...unfollowedAgencies.map((a) => ({ ...a, isFollowed: false })),
        ];
        if (mappedAgencies.length < take) {
            const remainingTake = take - mappedAgencies.length;
            const followedAgencies = await prisma_1.prisma.user.findMany({
                where: followedWhere,
                skip: 0,
                take: remainingTake,
                select: selectFields,
                orderBy: { createdAt: "desc" },
            });
            mappedAgencies = [
                ...mappedAgencies,
                ...followedAgencies.map((a) => ({ ...a, isFollowed: true })),
            ];
        }
    }
    else {
        const followedSkip = skip - totalUnfollowed;
        const followedAgencies = await prisma_1.prisma.user.findMany({
            where: followedWhere,
            skip: followedSkip,
            take,
            select: selectFields,
            orderBy: { createdAt: "desc" },
        });
        mappedAgencies = [
            ...followedAgencies.map((a) => ({ ...a, isFollowed: true })),
        ];
    }
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: mappedAgencies,
    };
};
exports.UserService = {
    getAllUsers,
    getUserById,
    updateProfile,
    deleteUser,
    banUser,
    approveAgency,
    getSuggestedUsers,
    getAllAgenciesForUser,
};
