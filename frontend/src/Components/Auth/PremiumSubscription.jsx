"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import SubNavbar from "../SubNavbar";
import {
  FaCrown,
  FaCheck,
  FaTimes,
  FaLock,
  FaUnlock,
  FaRegCreditCard,
  FaShieldAlt,
  FaBolt,
  FaGem,
} from "react-icons/fa";
import api from "../../api";

const PremiumSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  // Get auth state from Redux
  const auth = useSelector((state) => state.auth);
  const authToken = localStorage.getItem("authToken");

  // Debugging: Log auth info
  useEffect(() => {
    console.log("Auth state:", auth);
    console.log("Auth token:", authToken);
  }, [auth, authToken]);

  useEffect(() => {
    const handlePaymentReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentParam = urlParams.get("payment");
      let transactionId = urlParams.get("transactionId");
      const userId = urlParams.get("userId");
      let dataParam = urlParams.get("data");

      if (transactionId && transactionId.includes("?data=")) {
        const [cleanTransactionId, encodedData] = transactionId.split("?data=");
        transactionId = cleanTransactionId;
        dataParam = encodedData;
      }

      if (paymentParam === "success" && transactionId && userId) {
        try {
          setIsProcessing(true);
          setPaymentStatus("processing");

          // Decode the payment data if available
          let paymentData = null;
          if (dataParam) {
            try {
              paymentData = JSON.parse(
                decodeURIComponent(decodeURIComponent(dataParam))
              );
              console.log("Payment data:", paymentData);
            } catch (e) {
              console.error("Error parsing payment data:", e);
            }
          }

          // Remove the problematic query parameters
          window.history.replaceState({}, document.title, "/premium");

          // Verify payment with backend
          const verifyResponse = await api.post(
            "/esewa/verify",
            {
              transaction_uuid: transactionId,
              amount: localStorage.getItem("premiumAmount"),
              userId: auth.user._id,
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          console.log("Verify response full details:", verifyResponse);
          console.log("Verify response data:", verifyResponse.data);

          // Clear storage
          localStorage.removeItem("premiumTransactionId");
          localStorage.removeItem("premiumUserId");
          localStorage.removeItem("premiumAmount");
          localStorage.removeItem("premiumStartTime");

          // Refresh premium status
          const statusResponse = await api.get("/premium/status", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          setPremiumStatus(statusResponse.data);
          setPaymentStatus("success");
          toast.success("Premium subscription activated successfully!");
        } catch (error) {
          console.error("Payment verification error:", error);
          setPaymentStatus("failed");
          toast.error("Payment verification failed. Please contact support.");
        } finally {
          setIsProcessing(false);
        }
      }
    };

    handlePaymentReturn();
  }, [authToken, navigate]);

  // Check premium status
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        console.log("Checking premium status...");
        const response = await api.get("/premium/status", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log("Premium status response:", response.data);
        setPremiumStatus(response.data);
      } catch (error) {
        console.error("Error checking premium status:", error);
        if (error.response) {
          console.error("Error details:", error.response.data);
        }
        toast.error("Failed to check premium status");
      }
    };
    if (authToken) {
      checkPremiumStatus();
    }
  }, [authToken]);

  const handleSubscribe = async () => {
    if (!authToken) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      setIsProcessing(true);
      console.log("Initiating subscription...");

      // Generate a unique transaction ID
      const transaction_uuid = `PREMIUM-${auth.user._id}-${Date.now()}`;

      // 1. Initiate subscription on backend
      const initResponse = await api.post(
        "/premium/initiate",
        { duration: selectedPlan },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // 2. Get payment details from backend
      const paymentResponse = await api.post(
        "/esewa/premium-pay",
        {
          amount: initResponse.data.amount.toString(),
          transaction_uuid,
          userId: auth.user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Store transaction details
      localStorage.setItem("premiumTransactionId", transaction_uuid);
      localStorage.setItem("premiumUserId", auth.user._id);
      localStorage.setItem(
        "premiumAmount",
        initResponse.data.amount.toString()
      );
      localStorage.setItem("premiumStartTime", Date.now().toString());

      // 3. Submit form to eSewa
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      for (const key in paymentResponse.data.formData) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = paymentResponse.data.formData[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Subscription error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        toast.error(error.response.data.message || "Subscription failed");
      } else {
        toast.error("Subscription failed. Please try again.");
      }
      setIsProcessing(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const startTime = localStorage.getItem("premiumStartTime");
      if (
        startTime &&
        Date.now() - Number.parseInt(startTime) > 30 * 60 * 1000
      ) {
        localStorage.removeItem("premiumTransactionId");
        localStorage.removeItem("premiumUserId");
        localStorage.removeItem("premiumAmount");
        localStorage.removeItem("premiumStartTime");
      }
    };
  }, []);

  // Benefits data
  const benefits = [
    {
      icon: <FaUnlock className="h-5 w-5 text-emerald-400" />,
      title: "Ad-Free Experience",
      description: "Enjoy browsing without any advertisements or distractions.",
    },
    {
      icon: <FaGem className="h-5 w-5 text-emerald-400" />,
      title: "Exclusive Recipes",
      description:
        "Access premium recipes that are only available to subscribers.",
    },

    {
      icon: <FaBolt className="h-5 w-5 text-emerald-400" />,
      title: "Early Access",
      description:
        "Be the first to try new features before they're released to everyone.",
    },
  ];

  if (!authToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="w-full max-w-md bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-8 border-b border-gray-800 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-900/40 rounded-full mb-4">
              <FaCrown className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-emerald-400">
              Premium Access
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Login to unlock premium features
            </p>
          </div>
          <div className="p-8">
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-900/20 rounded-full flex items-center justify-center mr-3">
                    {benefit.icon}
                  </div>
                  <div className="text-gray-300">{benefit.title}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-lg hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg"
            >
              <FaLock className="h-5 w-5 mr-2" />
              Login to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (premiumStatus?.isPremium) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen">
        <SubNavbar />
        <div className="max-w-lg mx-auto my-10 px-4">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-8 border-b border-gray-800 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-900/40 rounded-full mb-4">
                <FaCrown className="h-10 w-10 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-emerald-400">
                Premium Member
              </h2>
              <p className="text-gray-300 text-sm mt-2">
                Thank you for your support!
              </p>
            </div>
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-block bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-xl p-6 mb-6">
                  <p className="text-gray-400 mb-1">
                    Your premium membership is active until
                  </p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {new Date(premiumStatus.expiryDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-800/50 p-3 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-900/20 rounded-full flex items-center justify-center mr-2">
                        {benefit.icon}
                      </div>
                      <div className="text-sm text-gray-300">
                        {benefit.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => navigate("/my-profile")}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-lg hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Go to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="w-full max-w-md bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-8 border-b border-gray-800 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-900/40 rounded-full mb-4 animate-pulse">
              <FaRegCreditCard className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-emerald-400">
              Processing Payment
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Please wait while we verify your transaction
            </p>
          </div>
          <div className="p-8">
            <div className="flex flex-col items-center justify-center py-6">
              <Loader />
              <p className="mt-6 text-gray-400 text-center">
                We're confirming your payment with our payment provider. This
                may take a moment...
              </p>
              <div className="w-full bg-gray-900 mt-6 p-4 rounded-lg">
                <div className="h-2 bg-emerald-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 animate-pulse rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="w-full max-w-md bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-8 border-b border-gray-800 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-900/40 rounded-full mb-4 animate-bounce">
              <FaCheck className="h-10 w-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-emerald-400">
              Payment Successful!
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              Your premium subscription is now active
            </p>
          </div>
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-xl p-6 mb-6">
                <p className="text-gray-400 mb-1">
                  Your premium access will expire on
                </p>
                {premiumStatus?.expiryDate && (
                  <p className="text-2xl font-bold text-emerald-400">
                    {new Date(premiumStatus.expiryDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {benefits.slice(0, 4).map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-800/50 p-3 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-900/20 rounded-full flex items-center justify-center mr-2">
                      {benefit.icon}
                    </div>
                    <div className="text-sm text-gray-300">{benefit.title}</div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-lg hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="w-full max-w-md bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 p-8 border-b border-gray-800 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-900/30 rounded-full mb-4">
              <FaTimes className="h-10 w-10 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-red-400">Payment Failed</h2>
            <p className="text-gray-300 text-sm mt-2">
              We couldn't process your payment
            </p>
          </div>
          <div className="p-8">
            <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-4 mb-8">
              <p className="text-gray-300 mb-2">
                The transaction was declined or interrupted.
              </p>
              <p className="text-gray-400 text-sm">
                This could be due to insufficient funds, network issues, or a
                timeout. Please try again or use a different payment method.
              </p>
            </div>
            <button
              onClick={() => {
                setPaymentStatus(null);
                window.location.reload();
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-lg hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main subscription page
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen text-gray-200">
      <SubNavbar />
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-900/30 rounded-full mb-6">
            <FaCrown className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-emerald-400 mb-3">
            Upgrade to Premium
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Unlock exclusive features and take your experience to the next level
            with our premium subscription
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Plans */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden transform transition-all duration-300 hover:shadow-emerald-900/20 hover:-translate-y-1">
            <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-emerald-400">
                Choose Your Plan
              </h2>
              <p className="text-gray-400 mt-1">
                Select the option that works best for you
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div
                  className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 relative ${
                    selectedPlan === "monthly"
                      ? "border-emerald-500 bg-emerald-900/20"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                  onClick={() => setSelectedPlan("monthly")}
                >
                  {selectedPlan === "monthly" && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <FaCheck className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="mb-2">
                    <span className="bg-emerald-900/30 text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-full">
                      MONTHLY
                    </span>
                  </div>
                  <div className="flex items-baseline mb-1">
                    <span className="text-3xl font-bold text-white">Rs 50</span>
                    <span className="text-gray-400 ml-1 text-sm">/month</span>
                  </div>
                  <p className="text-xs text-gray-400">Billed monthly</p>
                </div>

                <div
                  className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 relative ${
                    selectedPlan === "yearly"
                      ? "border-emerald-500 bg-emerald-900/20"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                  onClick={() => setSelectedPlan("yearly")}
                >
                  {selectedPlan === "yearly" && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <FaCheck className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="mb-2 flex justify-between items-center">
                    <span className="bg-emerald-900/30 text-emerald-400 text-xs font-medium px-2 py-1 rounded-full">
                      YEARLY
                    </span>
                    <span className="bg-green-900/30 text-green-400 text-xs font-medium px-2 py-1 rounded-full">
                      SAVE 50%
                    </span>
                  </div>
                  <div className="flex items-baseline mb-1">
                    <span className="text-3xl font-bold text-white">
                      Rs 100
                    </span>
                    <span className="text-gray-400 ml-1 text-sm">/year</span>
                  </div>
                  <p className="text-xs text-gray-400">Best value</p>
                </div>
              </div>

              {isProcessing ? (
                <div className="flex justify-center py-4">
                  <Loader />
                </div>
              ) : (
                <button
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-lg hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg"
                  disabled={isProcessing}
                >
                  <FaRegCreditCard className="h-5 w-5 mr-2" />
                  Subscribe with eSewa
                </button>
              )}

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By subscribing, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden transform transition-all duration-300 hover:shadow-emerald-900/20 hover:-translate-y-1">
            <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-emerald-400">
                Premium Benefits
              </h2>
              <p className="text-gray-400 mt-1">
                Everything you get with your premium subscription
              </p>
            </div>

            <div className="p-8">
              <ul className="space-y-6">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-900/20 rounded-full flex items-center justify-center mr-4">
                      <div className="w-10 h-10 flex items-center justify-center">
                        {benefit.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  </li>
                ))}

                <li className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-900/20 rounded-full flex items-center justify-center mr-4">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <FaShieldAlt className="h-5 w-5 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      100% Secure Payments
                    </h3>
                    <p className="text-gray-400">
                      All transactions are processed securely through our
                      trusted payment partners.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-emerald-400 mb-8">
            What Our Premium Members Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Sarah J.",
                quote:
                  "The premium recipes alone are worth the subscription. I've discovered so many amazing dishes!",
              },
              {
                name: "Michael T.",
                quote:
                  "Being able to browse without ads has made my experience so much better. Highly recommend upgrading.",
              },
              {
                name: "Priya K.",
                quote:
                  "The early access to new features makes me feel like a VIP. Love being part of the premium community!",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-emerald-800/30 transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-emerald-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
                <p className="text-emerald-400 font-medium">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-emerald-400 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                question: "How will I be billed?",
                answer:
                  "You'll be billed through eSewa according to the plan you choose. Monthly plans are billed every month, while yearly plans are billed once per year.",
              },
              {
                question: "Can I cancel my subscription?",
                answer:
                  "No, you cannot cancel your subscription. Your premium access will remain active until the end of your current billing period.",
              },
              {
                question: "What happens after I subscribe?",
                answer:
                  "After subscribing, you'll immediately gain access to all premium features. You'll see the premium badge on your profile and can access exclusive content.",
              },
              {
                question: "Is my payment information secure?",
                answer:
                  "Yes, all payment processing is handled securely by eSewa. We never store your payment information on our servers.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden"
              >
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSubscription;
