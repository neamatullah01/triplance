import { z } from 'zod';

const createCommentValidationSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Comment text is required'),
  }),
});

export const CommentValidation = {
  createCommentValidationSchema,
};
