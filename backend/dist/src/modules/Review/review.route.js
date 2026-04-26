"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)("TRAVELER"), (0, validateRequest_1.default)(review_validation_1.ReviewValidation.createReviewValidationSchema), review_controller_1.ReviewController.createReview);
router.get("/", (0, auth_1.default)("ADMIN"), review_controller_1.ReviewController.getAllReviews);
router.get("/:bookingId", (0, auth_1.default)("TRAVELER", "ADMIN"), review_controller_1.ReviewController.getReviewByBooking);
router.delete("/:id", (0, auth_1.default)("TRAVELER", "ADMIN"), review_controller_1.ReviewController.deleteReview);
exports.ReviewRoutes = router;
