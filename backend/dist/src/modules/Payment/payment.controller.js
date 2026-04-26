"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = exports.paymentWebhookController = exports.initiatePaymentController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const payment_service_1 = require("./payment.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../lib/prisma");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
// Handles frontend asking to pay
exports.initiatePaymentController = (0, catchAsync_1.default)(async (req, res) => {
    const { bookingId } = req.body;
    const result = await (0, payment_service_1.initiatePaymentService)(bookingId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Payment session created successfully",
        data: result,
    });
});
// Handles Stripe silently confirming payment in the background
const paymentWebhookController = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, // This is raw unparsed data
        sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error("Webhook Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // If payment succeeds, update database
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;
        if (bookingId) {
            try {
                // 1. Fetch the booking first to get the required travelerId
                const booking = await prisma_1.prisma.booking.findUnique({
                    where: { id: bookingId },
                    select: { travelerId: true }, // We only need the travelerId
                });
                if (!booking) {
                    console.error(`Webhook Error: Booking ${bookingId} not found in database.`);
                    return res.status(404).json({ error: "Booking not found" });
                }
                // 2. Run the transaction with the travelerId included
                await prisma_1.prisma.$transaction([
                    prisma_1.prisma.booking.update({
                        where: { id: bookingId },
                        data: { status: "CONFIRMED" },
                    }),
                    prisma_1.prisma.payment.create({
                        data: {
                            bookingId: bookingId,
                            travelerId: booking.travelerId, // <-- Added this required field!
                            amount: (session.amount_total || 0) / 100,
                            currency: "USD",
                            status: "PAID",
                            gateway: "STRIPE",
                            transactionId: session.payment_intent,
                        },
                    }),
                ]);
                console.log(`Payment successful and DB updated for booking: ${bookingId}`);
            }
            catch (dbError) {
                console.error("Database Transaction Error:", dbError);
                return res.status(500).json({ error: "Database update failed" });
            }
        }
    }
    // Always return a 200 to Stripe so they know we received the webhook
    res.status(200).json({ received: true });
};
exports.paymentWebhookController = paymentWebhookController;
const getAllPayments = (0, catchAsync_1.default)(async (req, res) => {
    const result = await payment_service_1.PaymentService.getAllPayments(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Payments retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
exports.PaymentController = {
    getAllPayments,
};
