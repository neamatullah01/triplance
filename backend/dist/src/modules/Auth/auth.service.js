"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../lib/prisma");
const auth_utils_1 = require("./auth.utils");
const registerUser = async (payload) => {
    const { name, email, password, role } = payload;
    const userExists = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (userExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User already exists');
    }
    const hashedPassword = await bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    const newUser = await prisma_1.prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role ? role : 'TRAVELER',
            isVerified: role === 'AGENCY' ? false : true,
        },
    });
    const jwtPayload = {
        userId: newUser.id,
        role: newUser.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            profileImage: newUser.profileImage,
        },
    };
};
const loginUser = async (payload) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { email: payload.email },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found!');
    }
    if (user.isBanned) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is banned!');
    }
    const isPasswordMatched = await bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid password');
    }
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
        },
    };
};
const refreshToken = async (token) => {
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt.refresh_secret);
    const { userId } = decoded;
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found!');
    }
    if (user.isBanned) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is banned!');
    }
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in);
    return {
        accessToken,
    };
};
exports.AuthService = {
    registerUser,
    loginUser,
    refreshToken,
};
