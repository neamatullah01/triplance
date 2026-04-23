import express from "express";
import { AgencyController } from "./agency.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// Ensure only authenticated users with the 'agency' role can access this
router.get(
  "/dashboard/stats",
  auth("AGENCY"),
  AgencyController.getDashboardStats,
);

export const AgencyRoutes = router;
