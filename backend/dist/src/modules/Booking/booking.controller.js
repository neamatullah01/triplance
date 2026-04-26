"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const booking_service_1 = require("./booking.service");
const createBooking = (0, catchAsync_1.default)(async (req, res) => {
    const result = await booking_service_1.BookingService.createBookingIntoDB(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Booking created successfully',
        data: result,
    });
});
const getAllBookings = (0, catchAsync_1.default)(async (req, res) => {
    const result = await booking_service_1.BookingService.getAllBookingsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Bookings retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getMyBookings = (0, catchAsync_1.default)(async (req, res) => {
    const result = await booking_service_1.BookingService.getMyBookingsFromDB(req.user, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Your bookings retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getAgencyBookings = (0, catchAsync_1.default)(async (req, res) => {
    const result = await booking_service_1.BookingService.getAgencyBookingsFromDB(req.user, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Agency bookings retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getBookingById = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await booking_service_1.BookingService.getBookingByIdFromDB(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Booking retrieved successfully',
        data: result,
    });
});
const updateBookingStatus = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await booking_service_1.BookingService.updateBookingStatusIntoDB(id, req.body.status, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Booking status updated successfully',
        data: result,
    });
});
const cancelBooking = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await booking_service_1.BookingService.cancelBookingFromDB(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Booking cancelled successfully',
        data: result,
    });
});
exports.BookingController = {
    createBooking,
    getAllBookings,
    getMyBookings,
    getAgencyBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
};
