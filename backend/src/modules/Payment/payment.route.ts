import express from "express";
import { initiatePaymentController } from "./payment.controller";

const router = express.Router();

// The frontend calls this route
router.post("/initiate", initiatePaymentController);

// NOTE: We do NOT put the webhook route here. It must go in app.ts!
export const PaymentRoutes = router;
