"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const review_service_1 = require("./review.service");
const createReview = (0, catchAsync_1.default)(async (req, res) => {
    const result = await review_service_1.ReviewService.createReviewIntoDB(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Review submitted successfully",
        data: result,
    });
});
const getAllReviews = (0, catchAsync_1.default)(async (req, res) => {
    const result = await review_service_1.ReviewService.getAllReviewsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Reviews retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getReviewsForPackage = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await review_service_1.ReviewService.getReviewsForPackageFromDB(id, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Package reviews retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const deleteReview = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await review_service_1.ReviewService.deleteReviewFromDB(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Review deleted successfully",
        data: result,
    });
});
const getReviewByBooking = (0, catchAsync_1.default)(async (req, res) => {
    const { bookingId } = req.params;
    const result = await review_service_1.ReviewService.getReviewByBookingAndUserFromDB(bookingId, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Review retrieved successfully",
        data: result,
    });
});
exports.ReviewController = {
    createReview,
    getAllReviews,
    getReviewsForPackage,
    getReviewByBooking,
    deleteReview,
};
