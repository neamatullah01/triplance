"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name cannot be empty").optional(),
        bio: zod_1.z.string().optional(),
        // We expect a Base64 string here now, so we just use .string()
        // without the .url() strict check.
        profileImage: zod_1.z.string().optional(),
        coverImage: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        // Add any other fields your Prisma schema allows them to update
        agencyName: zod_1.z.string().optional(),
        website: zod_1.z.string().optional(),
    }),
});
exports.UserValidation = {
    updateUserValidationSchema,
};
