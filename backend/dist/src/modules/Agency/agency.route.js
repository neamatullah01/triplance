"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const agency_controller_1 = require("./agency.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Ensure only authenticated users with the 'agency' role can access this
router.get("/dashboard/stats", (0, auth_1.default)("AGENCY"), agency_controller_1.AgencyController.getDashboardStats);
exports.AgencyRoutes = router;
