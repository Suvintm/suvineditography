// models/paymentModel.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: false, // optional at order creation
    },
    razorpay_signature: {
      type: String,
      required: false, // optional at order creation
    },
    amount: {
      type: Number,
      required: true,
    },
    creditsPurchased: {
      type: Number,
      required: true,
    },
    packName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  { timestamps: true }
);

const paymentModel =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default paymentModel;
