"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidation = void 0;
const zod_1 = require("zod");
const createCommentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        text: zod_1.z.string().min(1, 'Comment text is required'),
        parentId: zod_1.z.string().optional(),
    }),
});
exports.CommentValidation = {
    createCommentValidationSchema,
};
