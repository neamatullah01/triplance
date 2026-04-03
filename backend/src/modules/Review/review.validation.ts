import { z } from 'zod';

const createReviewValidationSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1, 'Booking ID is required'),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1, 'Comment is required'),
  }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
};
