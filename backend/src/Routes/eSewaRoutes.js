import express from "express";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import { Register } from "../Schema/model.js"; // Adjust path as needed
import moment from "moment";

dotenv.config();

const router = express.Router();

// Get configuration from environment variables or use defaults for development
const MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";
const SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const SUCCESS_URL =
  process.env.ESEWA_SUCCESS_URL || "http://localhost:8000/api/esewa/success";
const FAILURE_URL =
  process.env.ESEWA_FAILURE_URL || "http://localhost:8000/api/esewa/failure";

// eSewa Payment Request Route
router.post("/pay", async (req, res) => {
  try {
    const { amount, transaction_uuid, orderId } = req.body;

    console.log("Payment request received:", {
      amount,
      transaction_uuid,
      orderId,
    });

    if (!amount || !transaction_uuid) {
      return res.status(400).json({
        message: "Missing required parameters",
        required: ["amount", "transaction_uuid"],
      });
    }

    const total_amount = amount;

    // Fields that need to be signed
    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const productCode = MERCHANT_CODE;

    // Generate signature
    const stringToSign = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${productCode}`;
    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(stringToSign)
      .digest("base64");

    const esewaFormData = {
      amount: amount,
      tax_amount: "0",
      total_amount: total_amount,
      transaction_uuid: transaction_uuid,
      product_code: productCode,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${SUCCESS_URL}?orderId=${orderId}`,
      failure_url: `${FAILURE_URL}?orderId=${orderId}`,
      signed_field_names: signedFieldNames,
      signature: signature,
    };

    console.log("Generated eSewa form data:", esewaFormData);

    res.status(200).json({ formData: esewaFormData });
  } catch (error) {
    console.error("Payment creation error:", error);
    res
      .status(500)
      .json({ message: "Error processing payment", error: error.message });
  }
});

// eSewa Payment Success Route
router.get("/success", (req, res) => {
  try {
    const {
      data,
      orderId,
      "premium-subscription": premiumTransaction,
      userId,
    } = req.query;
    console.log("Success data received:", {
      data,
      orderId,
      premiumTransaction,
      userId,
    });

    // Check if this is a premium upgrade transaction
    if (premiumTransaction) {
      // Redirect to premium subscription page with specific parameters
      const redirectUrl = new URL(`${FRONTEND_URL}/premium-subscription`);

      // Add query parameters for premium verification
      redirectUrl.searchParams.append("payment", "success");
      redirectUrl.searchParams.append("transactionId", premiumTransaction);
      if (userId) {
        redirectUrl.searchParams.append("userId", userId);
      }

      console.log(
        "Redirecting to premium subscription page:",
        redirectUrl.toString()
      );
      res.redirect(redirectUrl.toString());
    } else if (orderId) {
      // Fallback for other transactions
      const redirectUrl = new URL(`${FRONTEND_URL}/order/${orderId || ""}`);
      res.redirect(redirectUrl.toString());
    } else {
      // Fallback redirect
      res.redirect(FRONTEND_URL);
    }
  } catch (error) {
    console.error("Error in success handler:", error);
    // On error, redirect to the frontend base URL
    res.redirect(FRONTEND_URL);
  }
});

// eSewa Payment Failure Route
router.get("/failure", (req, res) => {
  try {
    const { orderId } = req.query;
    console.log("Payment failure for order:", orderId);

    // If we have an order ID, redirect to that order page with failure status
    if (orderId) {
      res.redirect(`${FRONTEND_URL}/order/${orderId}?status=FAILED`);
    } else {
      // Otherwise just redirect to orders page
      res.redirect(`${FRONTEND_URL}/order`);
    }
  } catch (error) {
    console.error("Error in failure handler:", error);
    res.redirect(`${FRONTEND_URL}/order`);
  }
});

// Add this new route
// In your eSewa routes file
router.post("/premium-pay", async (req, res) => {
  try {
    const { amount, transaction_uuid, userId } = req.body;

    if (!amount || !transaction_uuid || !userId) {
      return res.status(400).json({
        message: "Missing required parameters",
      });
    }

    const total_amount = amount;
    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const productCode = MERCHANT_CODE;

    // Generate signature
    const stringToSign = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${productCode}`;
    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(stringToSign)
      .digest("base64");

    // Update success_url to a specific premium success endpoint
    const esewaFormData = {
      amount: amount,
      tax_amount: "0",
      total_amount: total_amount,
      transaction_uuid: transaction_uuid,
      product_code: productCode,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${SUCCESS_URL}?premium-subscription=${transaction_uuid}&userId=${userId}`,
      failure_url: `${FRONTEND_URL}/premium?payment=failed`,
      signed_field_names: signedFieldNames,
      signature: signature,
    };

    res.status(200).json({ formData: esewaFormData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing payment", error: error.message });
  }
});

// eSewa Payment Verification Route
// eSewa Payment Verification Route
// eSewa Payment Verification Route
router.post("/verify", async (req, res) => {
  try {
    const { transaction_uuid, amount, userId } = req.body;

    if (!transaction_uuid || !amount || !userId) {
      return res.status(400).json({
        message: "Missing required parameters",
        required: ["transaction_uuid", "amount", "userId"],
      });
    }

    // Generate signature for verification
    const stringToSign = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${MERCHANT_CODE}`;
    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(stringToSign)
      .digest("base64");

    // Use GET request with all required parameters
    const response = await axios.get(
      `https://rc-epay.esewa.com.np/api/epay/transaction/status?total_amount=${amount}&transaction_uuid=${transaction_uuid}&product_code=${MERCHANT_CODE}&signature=${encodeURIComponent(
        signature
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    if (
      response.data.status === "COMPLETE" ||
      response.data.response_code === "SUCCESS"
    ) {
      // Payment verified - update user to premium
      const duration = amount === "50" ? "monthly" : "yearly"; // Determine duration based on amount
      const expiryDate = moment()
        .add(duration === "monthly" ? 30 : 365, "days")
        .toDate();

      const updatedUser = await Register.findByIdAndUpdate(
        userId,
        {
          isPremium: true,
          premiumExpiryDate: expiryDate,
          lastPayment: {
            amount: amount,
            transactionId: transaction_uuid,
            date: new Date(),
          },
        },
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      res.json({
        success: true,
        message: "Payment Verified and Premium Activated!",
        user: {
          isPremium: updatedUser.isPremium,
          premiumExpiryDate: updatedUser.premiumExpiryDate,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Verification Failed",
        response: response.data,
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.response?.data || error.message,
    });
  }
});

// Get payment status (useful for polling)
// Get payment status (useful for polling)
router.get("/status/:transactionId", async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { amount } = req.query;

    if (!transactionId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing transaction ID or amount",
      });
    }

    // Updated verification logic
    const stringToSign = `total_amount=${amount},transaction_uuid=${transactionId},product_code=${MERCHANT_CODE}`;
    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(stringToSign)
      .digest("base64");

    const response = await axios.get(
      `https://rc-epay.esewa.com.np/api/epay/transaction/status?total_amount=${amount}&transaction_uuid=${transactionId}&product_code=${MERCHANT_CODE}&signature=${encodeURIComponent(
        signature
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    res.json({
      success:
        response.data.status === "COMPLETE" ||
        response.data.response_code === "SUCCESS",
      status: response.data.status || response.data.response_code,
      message:
        response.data.message ||
        (response.data.status === "COMPLETE"
          ? "Payment verified"
          : "Payment not completed"),
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({
      success: false,
      message: "Error checking payment status",
      error: error.response?.data || error.message,
    });
  }
});

export default router;
