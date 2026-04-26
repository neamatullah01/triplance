"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/initiate", payment_controller_1.initiatePaymentController);
router.get("/", (0, auth_1.default)("ADMIN"), payment_controller_1.PaymentController.getAllPayments);
exports.PaymentRoutes = router;
