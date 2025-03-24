import express from "express";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

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
    const { data, orderId } = req.query;
    console.log("Success data received:", { data, orderId });

    // Check if this is a premium upgrade transaction
    if (orderId && orderId.startsWith("PREMIUM-")) {
      // Redirect to premium page
      const redirectUrl = new URL(`${FRONTEND_URL}/premium`);

      // Pass all query parameters to the frontend
      Object.entries(req.query).forEach(([key, value]) => {
        redirectUrl.searchParams.append(key, value);
      });

      console.log("Redirecting to:", redirectUrl.toString());
      res.redirect(redirectUrl.toString());
    } else {
      // Regular order transaction
      const redirectUrl = new URL(`${FRONTEND_URL}/order/${orderId || ""}`);

      // Pass all query parameters to the frontend
      Object.entries(req.query).forEach(([key, value]) => {
        redirectUrl.searchParams.append(key, value);
      });

      console.log("Redirecting to:", redirectUrl.toString());
      res.redirect(redirectUrl.toString());
    }
  } catch (error) {
    console.error("Error in success handler:", error);
    // On error, redirect to the order page without parameters
    res.redirect(`${FRONTEND_URL}/order`);
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

// eSewa Payment Verification Route
router.post("/verify", async (req, res) => {
  try {
    const { transaction_uuid, amount } = req.body;

    console.log("Verification request:", { transaction_uuid, amount });

    if (!transaction_uuid || !amount) {
      return res.status(400).json({
        message: "Missing required parameters",
        required: ["transaction_uuid", "amount"],
      });
    }

    // Generate signature for verification
    const stringToSign = `transaction_uuid=${transaction_uuid},amount=${amount},product_code=${MERCHANT_CODE}`;
    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(stringToSign)
      .digest("base64");

    console.log("Sending verification request to eSewa");

    const response = await axios.post(
      "https://rc-epay.esewa.com.np/api/epay/main/v2/confirm",
      {
        transaction_uuid,
        amount,
        product_code: MERCHANT_CODE,
        signature,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("eSewa verification response:", response.data);

    if (response.data.status === "COMPLETE") {
      res.json({ success: true, message: "Payment Verified!" });
    } else {
      res.status(400).json({
        success: false,
        message: "Verification Failed",
        response: response.data,
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.response?.data || error.message,
    });
  }
});

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

    // Similar verification logic as in the verify endpoint
    const stringToSign = `transaction_uuid=${transactionId},amount=${amount},product_code=${MERCHANT_CODE}`;
    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(stringToSign)
      .digest("base64");

    const response = await axios.post(
      "https://rc-epay.esewa.com.np/api/epay/main/v2/confirm",
      {
        transaction_uuid: transactionId,
        amount,
        product_code: MERCHANT_CODE,
        signature,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: response.data.status === "COMPLETE",
      status: response.data.status,
      message:
        response.data.status === "COMPLETE"
          ? "Payment verified"
          : "Payment not completed",
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
