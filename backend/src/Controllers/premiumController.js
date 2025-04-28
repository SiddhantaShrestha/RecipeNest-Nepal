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
const ESEWA_VERIFY_URL =
  process.env.ESEWA_VERIFY_URL ||
  "https://rc-epay.esewa.com.np/api/epay/transaction/status";

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
    const amount = duration === "monthly" ? 50 : 500; // Corrected amounts

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

    // console.log("Verification Request Details:", {
    //   transaction_uuid,
    //   amount,
    //   userId,
    //   merchantCode: process.env.ESEWA_MERCHANT_CODE,
    //   verifyUrl: ESEWA_VERIFY_URL,
    // });

    // Validate input
    if (!transaction_uuid || !amount || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    // Verify payment with eSewa
    const stringToSign = `merchant_code=${MERCHANT_CODE},transaction_uuid=${transaction_uuid},product_code=${MERCHANT_CODE}`;
    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(stringToSign)
      .digest("base64");

    // console.log("Generated Signature:", signature);

    try {
      const response = await axios.post(
        ESEWA_VERIFY_URL,
        {
          merchant_code: MERCHANT_CODE,
          transaction_uuid,
          product_code: MERCHANT_CODE,
          signature,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      // console.log("eSewa Verification Full Response:", response);
      // console.log("eSewa Verification Response Data:", response.data);

      if (response.data.status === "COMPLETE") {
        // Payment verified - update user to premium
        const duration = amount === 50 ? "monthly" : "yearly";
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

        // console.log("Updated User:", updatedUser);

        res.json({
          success: true,
          message: "Premium subscription activated!",
          user: updatedUser,
        });
      } else {
        // console.error("Payment not complete:", response.data);
        res.status(400).json({
          success: false,
          message: "Payment verification failed",
          details: response.data,
        });
      }
    } catch (verifyError) {
      // console.error("eSewa Verification Complete Error:", {
      //   message: verifyError.message,
      //   response: verifyError.response?.data,
      //   status: verifyError.response?.status,
      //   fullError: verifyError,
      // });

      res.status(500).json({
        success: false,
        message: "Payment verification failed",
        error: verifyError.response?.data || verifyError.message,
        details: {
          verifyErrorMessage: verifyError.message,
          responseStatus: verifyError.response?.status,
          responseData: verifyError.response?.data,
        },
      });
    }
  } catch (error) {
    // console.error("Overall Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
      details: error,
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
