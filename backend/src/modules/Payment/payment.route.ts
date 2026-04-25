import express from "express";
import {
  initiatePaymentController,
  PaymentController,
} from "./payment.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/initiate", initiatePaymentController);
router.get("/", auth("ADMIN"), PaymentController.getAllPayments);

export const PaymentRoutes = router;
