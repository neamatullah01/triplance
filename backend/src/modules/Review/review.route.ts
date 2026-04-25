import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";

const router = express.Router();

router.post(
  "/",
  auth("TRAVELER"),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  ReviewController.createReview,
);

router.get("/", auth("ADMIN"), ReviewController.getAllReviews);

router.get(
  "/:bookingId",
  auth("TRAVELER", "ADMIN"),
  ReviewController.getReviewByBooking,
);

router.delete("/:id", auth("TRAVELER", "ADMIN"), ReviewController.deleteReview);

export const ReviewRoutes = router;
