import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import router from "./routes";
import { paymentWebhookController } from "./modules/Payment/payment.controller";

const app: Application = express();

// parsers
app.use(
  cors({
    origin: "http://localhost:3000", // Your Next.js frontend URL
    credentials: true, // MUST be true to accept the HTTP-only cookie!
  }),
);
// app.use(express.json());
app.use(cookieParser());

app.post(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentWebhookController,
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// application routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Triplance World!");
});

// Not Found
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
