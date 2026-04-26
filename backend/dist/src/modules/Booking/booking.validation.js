"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidation = void 0;
const zod_1 = require("zod");
const createBookingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        packageId: zod_1.z.string().min(1, 'Package ID is required'),
        selectedDate: zod_1.z.string().min(1, 'Selected Date is required').datetime(),
        numberOfTravelers: zod_1.z.number().int().positive('Number of travelers must be a positive integer'),
    }),
});
const updateBookingStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
    }),
});
exports.BookingValidation = {
    createBookingValidationSchema,
    updateBookingStatusValidationSchema,
};
