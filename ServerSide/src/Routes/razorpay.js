import express from "express";
import crypto from "crypto";
import razorpay from '../config/razorpay.js'
import User from "../models/user_Model.js";


const router = express.Router();

// Create order
router.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify payment
router.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    
    await User.findByIdAndUpdate(userId, { isPremium: true });
    res.json({ success: true, message: "Payment verified, premium activated" });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

export default router;
