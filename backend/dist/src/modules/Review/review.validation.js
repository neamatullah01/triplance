"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const createReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.string().min(1, 'Booking ID is required'),
        rating: zod_1.z.number().int().min(1).max(5),
        comment: zod_1.z.string().min(1, 'Comment is required'),
    }),
});
exports.ReviewValidation = {
    createReviewValidationSchema,
};
