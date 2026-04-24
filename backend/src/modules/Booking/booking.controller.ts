import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingService } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
  const result = await BookingService.createBookingIntoDB(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const result = await BookingService.getAllBookingsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getMyBookings = catchAsync(async (req, res) => {
  const result = await BookingService.getMyBookingsFromDB(req.user, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your bookings retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAgencyBookings = catchAsync(async (req, res) => {
  const result = await BookingService.getAgencyBookingsFromDB(req.user, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Agency bookings retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getBookingById = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await BookingService.getBookingByIdFromDB(id, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking retrieved successfully',
    data: result,
  });
});

const updateBookingStatus = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await BookingService.updateBookingStatusIntoDB(id, req.body.status, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking status updated successfully',
    data: result,
  });
});

const cancelBooking = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await BookingService.cancelBookingFromDB(id, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking cancelled successfully',
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getAgencyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};
