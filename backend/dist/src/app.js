"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const routes_1 = __importDefault(require("./routes"));
const payment_controller_1 = require("./modules/Payment/payment.controller");
const app = (0, express_1.default)();
// parsers
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // Your Next.js frontend URL
    credentials: true, // MUST be true to accept the HTTP-only cookie!
}));
// app.use(express.json());
app.use((0, cookie_parser_1.default)());
app.post("/api/v1/payments/webhook", express_1.default.raw({ type: "application/json" }), payment_controller_1.paymentWebhookController);
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// application routes
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello from Triplance World!");
});
// Not Found
app.use(notFound_1.default);
// Global Error Handler
app.use(globalErrorHandler_1.default);
exports.default = app;
