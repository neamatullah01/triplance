import Stripe from "stripe";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const initiatePaymentService = async (bookingId: string) => {
  // 1. Check if booking exists
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { package: true, traveler: true },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
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
