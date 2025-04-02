import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import SubNavbar from "../SubNavbar";

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
          const verifyResponse = await axios.post(
            "http://localhost:8000/api/esewa/verify",
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
          const statusResponse = await axios.get(
            "http://localhost:8000/api/premium/status",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

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
        const response = await axios.get(
          "http://localhost:8000/api/premium/status",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
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
      const initResponse = await axios.post(
        "http://localhost:8000/api/premium/initiate",
        { duration: selectedPlan },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // 2. Get payment details from backend
      const paymentResponse = await axios.post(
        "http://localhost:8000/api/esewa/premium-pay",
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
      if (startTime && Date.now() - parseInt(startTime) > 30 * 60 * 1000) {
        localStorage.removeItem("premiumTransactionId");
        localStorage.removeItem("premiumUserId");
        localStorage.removeItem("premiumAmount");
        localStorage.removeItem("premiumStartTime");
      }
    };
  }, []);

  if (!authToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f0f10]">
        <div className="w-full max-w-md bg-gradient-to-b from-[#1a1a1c] to-[#141416] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="bg-blue-900/20 p-6 border-b border-gray-800">
            <h2 className="text-3xl font-bold text-blue-400 text-center">
              Premium Access
            </h2>
            <p className="text-gray-400 text-center mt-2">
              Login to unlock premium features
            </p>
          </div>
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-900/20 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H16a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Login to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (premiumStatus?.isPremium) {
    return (
      <div className="bg-[#0f0f10] min-h-screen">
        <SubNavbar />
        <div className="max-w-lg mx-auto my-10 px-4">
          <div className="bg-gradient-to-b from-[#1a1a1c] to-[#141416] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-6 border-b border-gray-800">
              <h2 className="text-3xl font-bold text-green-400 text-center">
                Premium Member
              </h2>
              <p className="text-gray-300 text-center mt-2">
                Thank you for your support!
              </p>
            </div>
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-green-900/20 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center mb-8">
                <p className="text-xl mb-2 text-gray-300">
                  Your premium membership is active
                </p>
                <div className="bg-[#0f0f10] rounded-lg p-4 inline-block">
                  <p className="text-gray-400">Expires on:</p>
                  <p className="text-2xl font-bold text-green-400">
                    {new Date(premiumStatus.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/my-profile")}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg"
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f0f10]">
        <div className="w-full max-w-md bg-gradient-to-b from-[#1a1a1c] to-[#141416] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="bg-blue-900/20 p-6 border-b border-gray-800">
            <h2 className="text-3xl font-bold text-blue-400 text-center">
              Processing Payment
            </h2>
          </div>
          <div className="p-8">
            <div className="flex flex-col items-center justify-center py-6">
              <Loader />
              <p className="mt-6 text-gray-400 text-center">
                Please wait while we verify your payment...
              </p>
              <div className="w-full bg-[#0f0f10] mt-6 p-4 rounded-lg">
                <div className="h-2 bg-blue-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 animate-pulse rounded-full"></div>
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f0f10]">
        <div className="w-full max-w-md bg-gradient-to-b from-[#1a1a1c] to-[#141416] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-6 border-b border-gray-800">
            <h2 className="text-3xl font-bold text-green-400 text-center">
              Payment Successful!
            </h2>
          </div>
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-900/20 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center mb-8">
              <p className="text-xl mb-4 text-gray-300">
                Your premium subscription has been activated
              </p>
              {premiumStatus?.expiryDate && (
                <div className="bg-[#0f0f10] rounded-lg p-4">
                  <p className="text-gray-400">
                    Your premium access will expire on:
                  </p>
                  <p className="text-2xl font-bold text-green-400">
                    {new Date(premiumStatus.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg"
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f0f10]">
        <div className="w-full max-w-md bg-gradient-to-b from-[#1a1a1c] to-[#141416] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="bg-red-900/20 p-6 border-b border-gray-800">
            <h2 className="text-3xl font-bold text-red-400 text-center">
              Payment Failed
            </h2>
          </div>
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center mb-8">
              <p className="text-xl mb-2 text-gray-300">
                We couldn't process your payment
              </p>
              <p className="text-gray-500">
                The transaction was declined or interrupted. Please try again or
                contact support.
              </p>
            </div>
            <button
              onClick={() => {
                setPaymentStatus(null);
                window.location.reload();
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg"
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
    <div className="bg-[#0f0f10] min-h-screen">
      <SubNavbar />
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text">
            Upgrade Your Experience
          </h1>
          <p className="text-gray-400 mt-2">
            Unlock premium features and take your experience to the next level
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plans */}
          <div className="bg-gradient-to-b from-[#1a1a1c] to-[#141416] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-blue-400">
                Choose Your Plan
              </h2>
              <p className="text-gray-400 mt-1">
                Select the option that works best for you
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div
                  className={`p-5 border rounded-xl cursor-pointer transition-all duration-300 relative ${
                    selectedPlan === "monthly"
                      ? "border-blue-500 bg-blue-900/20"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                  onClick={() => setSelectedPlan("monthly")}
                >
                  {selectedPlan === "monthly" && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="mb-2">
                    <span className="bg-blue-900/30 text-blue-400 text-xs font-medium px-2.5 py-0.5 rounded">
                      MONTHLY
                    </span>
                  </div>
                  <div className="flex items-baseline mb-1">
                    <span className="text-3xl font-bold text-white">Rs 50</span>
                    <span className="text-gray-400 ml-1">/month</span>
                  </div>
                  <p className="text-sm text-gray-400">Billed monthly</p>
                </div>

                <div
                  className={`p-5 border rounded-xl cursor-pointer transition-all duration-300 relative ${
                    selectedPlan === "yearly"
                      ? "border-blue-500 bg-blue-900/20"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                  onClick={() => setSelectedPlan("yearly")}
                >
                  {selectedPlan === "yearly" && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="mb-2 flex justify-between items-center">
                    <span className="bg-blue-900/30 text-blue-400 text-xs font-medium px-2.5 py-0.5 rounded">
                      YEARLY
                    </span>
                    <span className="bg-green-900/30 text-green-400 text-xs font-medium px-2.5 py-0.5 rounded">
                      SAVE 50%
                    </span>
                  </div>
                  <div className="flex items-baseline mb-1">
                    <span className="text-3xl font-bold text-white">
                      Rs 100
                    </span>
                    <span className="text-gray-400 ml-1">/year</span>
                  </div>
                  <p className="text-sm text-gray-400">Best value</p>
                </div>
              </div>

              {isProcessing ? (
                <div className="flex justify-center py-4">
                  <Loader />
                </div>
              ) : (
                <button
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg"
                  disabled={isProcessing}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Subscribe with eSewa
                </button>
              )}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-b from-[#1a1a1c] to-[#141416] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-blue-400">
                Premium Benefits
              </h2>
              <p className="text-gray-400 mt-1">
                Everything you get with your premium subscription
              </p>
            </div>

            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-900/20 rounded-full flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300">
                      Ad-Free Experience
                    </h3>
                    <p className="text-gray-400">
                      Enjoy browsing without any advertisements or distractions.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-900/20 rounded-full flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300">
                      Exclusive Recipes
                    </h3>
                    <p className="text-gray-400">
                      Access premium recipes that are only available to
                      subscribers.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-900/20 rounded-full flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300">
                      Priority Support
                    </h3>
                    <p className="text-gray-400">
                      Get fast responses from our dedicated support team.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-900/20 rounded-full flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300">
                      Early Access
                    </h3>
                    <p className="text-gray-400">
                      Be the first to try new features before they're released
                      to everyone.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSubscription;
