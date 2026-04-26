"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const registerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        role: zod_1.z.enum(['TRAVELER', 'AGENCY']).optional(),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, 'Refresh token is required!'),
    }),
});
exports.AuthValidation = {
    registerValidationSchema,
    loginValidationSchema,
    refreshTokenValidationSchema,
};
