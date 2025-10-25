import Razorpay from "razorpay";
import crypto from "crypto";
import paymentModel from "../model/paymentModel.js";
import userModel from "../model/userModel.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { amount, credits, packName } = req.body;
    if (!amount || !credits || !packName)
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `rcpt_${Math.floor(Math.random() * 100000)}`,
      notes: { userId: req.user.id, credits, packName },
    };

    const order = await razorpay.orders.create(options);

    // Save order to DB (payment_id and signature will be updated later)
    const newPayment = new paymentModel({
      userId: req.user.id,
      razorpay_order_id: order.id,
      amount: amount,
      creditsPurchased: credits,
      packName,
      status: "created",
    });

    await newPayment.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// Verify payment and update DB
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      credits,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
      return res
        .status(400)
        .json({ success: false, message: "Missing payment info" });

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature)
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });

    // Update payment record in DB
    const payment = await paymentModel.findOne({ razorpay_order_id });
    if (!payment)
      return res
        .status(404)
        .json({ success: false, message: "Payment record not found" });

    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    payment.status = "paid";

    await payment.save();

    // Update user credits
    const user = await userModel.findById(payment.userId);
    user.creditBalance += credits;
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: `${credits} credits added successfully`,
      });
  } catch (error) {
    console.error("Verify payment error:", error);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
};

// Razorpay webhook handler
export const paymentWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const cryptoSignature = req.headers["x-razorpay-signature"];
    const body = req.rawBody.toString();

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (cryptoSignature !== expectedSignature)
      return res.status(400).send("Invalid signature");

    const event = req.body.event;

    if (event === "payment.captured") {
      const paymentData = req.body.payload.payment.entity;
      const userId = paymentData.notes.userId;
      const credits = Number(paymentData.notes.credits);
      const packName = paymentData.notes.packName;

      // Update DB
      let payment = await paymentModel.findOne({
        razorpay_order_id: paymentData.order_id,
      });
      if (payment) {
        payment.razorpay_payment_id = paymentData.id;
        payment.razorpay_signature = cryptoSignature;
        payment.status = "paid";
        await payment.save();
      } else {
        // if payment record does not exist, create
        payment = new paymentModel({
          userId,
          razorpay_order_id: paymentData.order_id,
          razorpay_payment_id: paymentData.id,
          razorpay_signature: cryptoSignature,
          amount: paymentData.amount / 100,
          creditsPurchased: credits,
          packName,
          status: "paid",
        });
        await payment.save();
      }

      // Update user credits
      const user = await userModel.findById(userId);
      if (user) {
        user.creditBalance += credits;
        await user.save();
      }
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Webhook processing failed");
  }
};
