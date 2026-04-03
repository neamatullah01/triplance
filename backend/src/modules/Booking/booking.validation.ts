import { z } from 'zod';

const createBookingValidationSchema = z.object({
  body: z.object({
    packageId: z.string().min(1, 'Package ID is required'),
    selectedDate: z.string().min(1, 'Selected Date is required').datetime(),
    numberOfTravelers: z.number().int().positive('Number of travelers must be a positive integer'),
  }),
});

const updateBookingStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  }),
});

export const BookingValidation = {
  createBookingValidationSchema,
  updateBookingStatusValidationSchema,
};
