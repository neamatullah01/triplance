import { z } from 'zod';

const createPostValidationSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Content is required'),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updatePostValidationSchema = z.object({
  body: z.object({
    content: z.string().optional(),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const PostValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
