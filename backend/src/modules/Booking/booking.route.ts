import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';
import { BookingController } from './booking.controller';

const router = express.Router();

router.post(
  '/',
  auth('TRAVELER'),
  validateRequest(BookingValidation.createBookingValidationSchema),
  BookingController.createBooking
);

router.get(
  '/',
  auth('ADMIN'),
  BookingController.getAllBookings
);

router.get(
  '/my',
  auth('TRAVELER'),
  BookingController.getMyBookings
);

router.get(
  '/:id',
  auth('TRAVELER', 'AGENCY', 'ADMIN'),
  BookingController.getBookingById
);

router.patch(
  '/:id/status',
  auth('AGENCY', 'ADMIN'),
  validateRequest(BookingValidation.updateBookingStatusValidationSchema),
  BookingController.updateBookingStatus
);

router.delete(
  '/:id',
  auth('TRAVELER', 'ADMIN'),
  BookingController.cancelBooking
);

export const BookingRoutes = router;
