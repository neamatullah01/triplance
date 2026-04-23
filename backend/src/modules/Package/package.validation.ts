import { z } from "zod";

const createPackageValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().positive("Price must be positive"),
    maxCapacity: z
      .number()
      .int()
      .positive("Max capacity must be positive integer"),
    // Prisma receives DateTime as string or Date object. z.string().datetime() works well for JSON parsing.
    availableDates: z
      .array(z.string().datetime())
      .nonempty("At least one available date is required"),
    amenities: z
      .array(z.string())
      .nonempty("At least one amenity must be provided"),
    itinerary: z.any(),
    images: z
      .array(z.string().url())
      .nonempty("At least one image URL must be provided"),
    destination: z.string().min(1, "Destination is required"),
    lastBookingDay: z
      .string()
      .datetime({ message: "lastBookingDay must be a valid ISO datetime" })
      .optional(),
  }),
});

const updatePackageValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    maxCapacity: z.number().int().positive().optional(),

    // The dates are perfectly handled because your frontend uses .toISOString()
    availableDates: z.array(z.string().datetime()).optional(),
    amenities: z.array(z.string()).optional(),

    // z.any() works, though strictly you could do z.array(z.object({ day: z.number(), activity: z.string() }))
    itinerary: z.any().optional(),

    // ✅ FIX: Removed .url() so it accepts Base64 Data URIs without crashing
    images: z.array(z.string()).optional(),

    destination: z.string().optional(),
    isActive: z.boolean().optional(),
    lastBookingDay: z
      .string()
      .datetime({ message: "lastBookingDay must be a valid ISO datetime" })
      .optional(),
  }),
});

export const PackageValidation = {
  createPackageValidationSchema,
  updatePackageValidationSchema,
};
