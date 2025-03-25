import { Register } from "../Schema/model.js";
import crypto from "crypto";
import axios from "axios";
import moment from "moment";

const MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";
const SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const SUCCESS_URL =
  process.env.ESEWA_SUCCESS_URL || "http://localhost:8000/api/esewa/success";
const FAILURE_URL =
  process.env.ESEWA_FAILURE_URL || "http://localhost:8000/api/esewa/failure";

export const initiatePremiumSubscription = async (req, res) => {
  try {
    const userId = req._id;
    const { duration } = req.body; // 'monthly' or 'yearly'

    if (!["monthly", "yearly"].includes(duration)) {
      return res.status(400).json({ message: "Invalid duration" });
    }

    const user = await Register.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate amount based on duration
    const amount = duration === "monthly" ? 500 : 5000; // Example amounts in NPR

    res.status(200).json({
      success: true,
      amount,
      duration,
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPremiumPayment = async (req, res) => {
  try {
    const { transaction_uuid, amount, userId } = req.body;

    console.log("Verification Request Details:", {
      transaction_uuid,
      amount,
      userId,
      merchantCode: process.env.ESEWA_MERCHANT_CODE,
    });

    // Verify payment with eSewa
    const stringToSign = `transaction_uuid=${transaction_uuid},amount=${amount},product_code=${process.env.ESEWA_MERCHANT_CODE}`;
    const signature = crypto
      .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
      .update(stringToSign)
      .digest("base64");

    console.log("Generated Signature:", signature);

    try {
      const response = await axios.post(
        "https://rc-epay.esewa.com.np/api/epay/main/v2/confirm",
        {
          transaction_uuid,
          amount,
          product_code: process.env.ESEWA_MERCHANT_CODE,
          signature,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      console.log("eSewa Verification Response:", response.data);

      if (response.data.status === "COMPLETE") {
        // Payment verified - update user to premium
        const duration = amount === 500 ? "monthly" : "yearly";
        const expiryDate = moment()
          .add(duration === "monthly" ? 30 : 365, "days")
          .toDate();

        const updatedUser = await Register.findByIdAndUpdate(
          userId,
          {
            isPremium: true,
            premiumExpiryDate: expiryDate,
          },
          { new: true }
        );

        console.log("Updated User:", updatedUser);

        res.json({
          success: true,
          message: "Premium subscription activated!",
          user: updatedUser,
        });
      } else {
        console.error("Payment not complete:", response.data);
        res.status(400).json({
          success: false,
          message: "Payment verification failed",
          details: response.data,
        });
      }
    } catch (verifyError) {
      console.error("eSewa Verification Error:", {
        message: verifyError.message,
        response: verifyError.response?.data,
        status: verifyError.response?.status,
      });

      res.status(500).json({
        success: false,
        message: "Payment verification failed",
        error: verifyError.response?.data || verifyError.message,
      });
    }
  } catch (error) {
    console.error("Overall Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const checkPremiumStatus = async (req, res) => {
  try {
    const userId = req._id;
    const user = await Register.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isActive =
      user.isPremium &&
      (!user.premiumExpiryDate ||
        new Date(user.premiumExpiryDate) > new Date());

    res.status(200).json({
      isPremium: isActive,
      expiryDate: user.premiumExpiryDate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
