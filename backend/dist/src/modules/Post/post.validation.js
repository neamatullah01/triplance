"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = void 0;
const zod_1 = require("zod");
const createPostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().min(1, 'Content is required'),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
const updatePostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.PostValidation = {
    createPostValidationSchema,
    updatePostValidationSchema,
};
