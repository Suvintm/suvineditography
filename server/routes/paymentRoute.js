import express from "express";
import {
  createOrder,
  verifyPayment,
  paymentWebhook,
} from "../controllers/paymentController.js";
import userAuth from "../middleware/auth.js";
import bodyParser from "body-parser";

const router = express.Router();

// Razorpay webhook route must use raw body parser
router.post("/webhook", bodyParser.raw({ type: "*/*" }), paymentWebhook);

router.post("/create-order", userAuth, createOrder);
router.post("/verify-payment", userAuth, verifyPayment);

export default router;
