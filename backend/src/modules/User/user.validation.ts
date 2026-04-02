import { z } from 'zod';

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    profileImage: z.string().url('Invalid URL').optional(),
    bio: z.string().optional(),
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