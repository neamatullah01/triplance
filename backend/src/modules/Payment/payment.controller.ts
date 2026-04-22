import { Request, Response } from "express";
import Stripe from "stripe";
import { initiatePaymentService } from "./payment.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Handles frontend asking to pay
export const initiatePaymentController = catchAsync(
  async (req: Request, res: Response) => {
    const { bookingId } = req.body;
    const result = await initiatePaymentService(bookingId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment session created successfully",
      data: result,
    });
  },
);

// Handles Stripe silently confirming payment in the background
export const paymentWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // This is raw unparsed data
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // If payment succeeds, update database
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      try {
        // 1. Fetch the booking first to get the required travelerId
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          select: { travelerId: true }, // We only need the travelerId
        });

        if (!booking) {
          console.error(
            `Webhook Error: Booking ${bookingId} not found in database.`,
          );
          return res.status(404).json({ error: "Booking not found" });
        }

        // 2. Run the transaction with the travelerId included
        await prisma.$transaction([
          prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" },
          }),
          prisma.payment.create({
            data: {
              bookingId: bookingId,
              travelerId: booking.travelerId, // <-- Added this required field!
              amount: (session.amount_total || 0) / 100,
              currency: "USD",
              status: "PAID",
              gateway: "STRIPE",
              transactionId: session.payment_intent as string,
            },
          }),
        ]);

        console.log(
          `Payment successful and DB updated for booking: ${bookingId}`,
        );
      } catch (dbError) {
        console.error("Database Transaction Error:", dbError);
        return res.status(500).json({ error: "Database update failed" });
      }
    }
  }

  // Always return a 200 to Stripe so they know we received the webhook
  res.status(200).json({ received: true });
};
