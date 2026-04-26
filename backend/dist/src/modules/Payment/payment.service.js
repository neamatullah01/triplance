"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = exports.initiatePaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../lib/prisma");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const initiatePaymentService = async (bookingId) => {
    // 1. Check if booking exists
    const booking = await prisma_1.prisma.booking.findUnique({
        where: { id: bookingId },
        include: { package: true, traveler: true },
    });
    if (!booking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
    }
    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: booking.traveler.email,
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: booking.package.title,
                        description: `Triplance Booking for ${booking.seats || 1} travelers`,
                    },
                    unit_amount: Math.round(booking.totalPrice * 100), // Stripe uses cents
                },
                quantity: 1,
            },
        ],
        // Attach the booking ID so we can identify it later
        metadata: {
            bookingId: booking.id,
        },
        success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    });
    return { paymentUrl: session.url };
};
exports.initiatePaymentService = initiatePaymentService;
const getAllPayments = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";
    // Extract filters
    const { status, gateway, searchTerm } = query;
    // Build the where clause
    const whereConditions = {};
    if (status) {
        whereConditions.status = status;
    }
    if (gateway) {
        whereConditions.gateway = gateway;
    }
    if (searchTerm) {
        whereConditions.OR = [
            {
                transactionId: { contains: searchTerm, mode: "insensitive" },
            },
            { id: { contains: searchTerm, mode: "insensitive" } },
        ];
    }
    const result = await prisma_1.prisma.payment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            booking: true,
            traveler: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    const total = await prisma_1.prisma.payment.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
exports.PaymentService = {
    getAllPayments,
};
