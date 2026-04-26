"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageValidation = void 0;
const zod_1 = require("zod");
const createPackageValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required"),
        description: zod_1.z.string().min(1, "Description is required"),
        price: zod_1.z.number().positive("Price must be positive"),
        maxCapacity: zod_1.z
            .number()
            .int()
            .positive("Max capacity must be positive integer"),
        // Prisma receives DateTime as string or Date object. z.string().datetime() works well for JSON parsing.
        availableDates: zod_1.z
            .array(zod_1.z.string().datetime())
            .nonempty("At least one available date is required"),
        amenities: zod_1.z
            .array(zod_1.z.string())
            .nonempty("At least one amenity must be provided"),
        itinerary: zod_1.z.any(),
        images: zod_1.z
            .array(zod_1.z.string().url())
            .nonempty("At least one image URL must be provided"),
        destination: zod_1.z.string().min(1, "Destination is required"),
        lastBookingDay: zod_1.z
            .string()
            .datetime({ message: "lastBookingDay must be a valid ISO datetime" })
            .optional(),
    }),
});
const updatePackageValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().positive().optional(),
        maxCapacity: zod_1.z.number().int().positive().optional(),
        // The dates are perfectly handled because your frontend uses .toISOString()
        availableDates: zod_1.z.array(zod_1.z.string().datetime()).optional(),
        amenities: zod_1.z.array(zod_1.z.string()).optional(),
        // z.any() works, though strictly you could do z.array(z.object({ day: z.number(), activity: z.string() }))
        itinerary: zod_1.z.any().optional(),
        // ✅ FIX: Removed .url() so it accepts Base64 Data URIs without crashing
        images: zod_1.z.array(zod_1.z.string()).optional(),
        destination: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
        lastBookingDay: zod_1.z
            .string()
            .datetime({ message: "lastBookingDay must be a valid ISO datetime" })
            .optional(),
    }),
});
exports.PackageValidation = {
    createPackageValidationSchema,
    updatePackageValidationSchema,
};
