import express from "express";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import Register from "../Schema/registerSchema.js";

dotenv.config();

const router = express.Router();

// Existing eSewa configuration
const MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";
const SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Premium Upgrade Route
router.post("/upgrade", async (req, res) => {
  try {
    const { userId, planType } = req.body;

    // Validate user
    const user = await Register.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Define pricing based on plan type
    const premiumPlans = {
      monthly: 499, // Rs 499 for monthly plan
      yearly: 4999, // Rs 4999 for yearly plan
    };

    const amount = premiumPlans[planType];
    if (!amount) {
      return res.status(400).json({ message: "Invalid plan type" });
    }

    // Generate a unique transaction ID
    const transaction_uuid = `PREMIUM-${userId}-${planType}-${Date.now()}`;

    const esewaFormData = {
      amount: amount.toString(),
      tax_amount: "0",
      total_amount: amount.toString(),
      transaction_uuid: transaction_uuid,
      product_code: MERCHANT_CODE,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${FRONTEND_URL}/premium?status=success&planType=${planType}`,
      failure_url: `${FRONTEND_URL}/premium?status=failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: crypto
        .createHmac("sha256", SECRET_KEY)
        .update(
          `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${MERCHANT_CODE}`
        )
        .digest("base64"),
    };

    res.status(200).json({ formData: esewaFormData });
  } catch (error) {
    console.error("Premium upgrade error:", error);
    res
      .status(500)
      .json({
        message: "Error processing premium upgrade",
        error: error.message,
      });
  }
});

// Verify Premium Upgrade
router.post("/verify-upgrade", async (req, res) => {
  try {
    const { userId, planType, transaction_uuid, amount } = req.body;

    // Verify transaction with eSewa
    const verifyResponse = await axios.post(
      "https://rc-epay.esewa.com.np/api/epay/main/v2/confirm",
      {
        transaction_uuid,
        amount,
        product_code: MERCHANT_CODE,
        signature: crypto
          .createHmac("sha256", SECRET_KEY)
          .update(
            `transaction_uuid=${transaction_uuid},amount=${amount},product_code=${MERCHANT_CODE}`
          )
          .digest("base64"),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // If payment is successful, upgrade user's premium status
    if (verifyResponse.data.status === "COMPLETE") {
      const user = await Register.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Set premium status and expiry date
      user.isPremium = true;
      user.premiumExpiryDate =
        planType === "monthly"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 365 days

      await user.save();

      return res.json({
        success: true,
        message: "Premium upgrade successful",
        premiumExpiryDate: user.premiumExpiryDate,
      });
    }

    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  } catch (error) {
    console.error("Premium upgrade verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying premium upgrade",
      error: error.message,
    });
  }
});

export default router;
