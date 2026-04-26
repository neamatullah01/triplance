"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const prisma_1 = require("../lib/prisma");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        // let token = req.headers.authorization;
        let token = req.cookies?.token || req.headers.authorization;
        if (token && token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }
        // checking if the token is missing
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        // checking if the given token is valid
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.access_secret);
        }
        catch (err) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized!");
        }
        const { userId, role } = decoded;
        // checking if the user is exist
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
        }
        // checking if the user is banned
        if (user.isBanned) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is banned!");
        }
        if (requiredRoles &&
            requiredRoles.length > 0 &&
            !requiredRoles.includes(role)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        req.user = decoded;
        next();
    });
};
exports.default = auth;
