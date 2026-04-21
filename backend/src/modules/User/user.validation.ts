import { z } from 'zod';

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    bio: z.string().optional(),
    
    // We expect a Base64 string here now, so we just use .string() 
    // without the .url() strict check.
    profileImage: z.string().optional(),
    coverImage: z.string().optional(),

    // Add any other fields your Prisma schema allows them to update
    agencyName: z.string().optional(),
    website: z.string().optional(),
  }),
});

const banUserValidationSchema = z.object({
  body: z.object({
    isBanned: z.boolean(),
  }),
});

const approveAgencyValidationSchema = z.object({
  body: z.object({
    isVerified: z.boolean(),
  }),
});

export const UserValidation = {
  updateUserValidationSchema,
  banUserValidationSchema,
  approveAgencyValidationSchema,
};