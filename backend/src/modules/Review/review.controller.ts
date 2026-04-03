import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req, res) => {
  const result = await ReviewService.createReviewIntoDB(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review submitted successfully',
    data: result,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const result = await ReviewService.getAllReviewsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getReviewsForPackage = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await ReviewService.getReviewsForPackageFromDB(id, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Package reviews retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await ReviewService.deleteReviewFromDB(id, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  getReviewsForPackage,
  deleteReview,
};
