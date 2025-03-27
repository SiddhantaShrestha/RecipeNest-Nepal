import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import SubNavbar from "../SubNavbar";
import Navbar from "../Navbar";

const PremiumSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  // Get auth state from Redux like in Navigation component
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
              // Double decode to handle potential double encoding
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
      <div className="max-w-md mx-auto my-10 p-6 bg-[#1a1a1c] rounded-xl shadow-2xl border border-gray-800">
        <h2 className="text-2xl font-bold text-gray-200 mb-4 text-center">
          Please Login to Subscribe
        </h2>
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
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
    );
  }

  if (premiumStatus?.isPremium) {
    return (
      <div>
        <Navbar />
        <SubNavbar />
        <div className="max-w-md mx-auto my-10 p-6 bg-[#1a1a1c] rounded-xl shadow-2xl border border-gray-800">
          <h2 className="text-2xl font-bold text-green-400 mb-4 text-center">
            Premium Member
          </h2>
          <p className="mb-4 text-gray-300 text-center">
            You are already a premium member. Your subscription will expire on{" "}
            <span className="text-green-400 font-semibold">
              {new Date(premiumStatus.expiryDate).toLocaleDateString()}
            </span>
          </p>
          <button
            onClick={() => navigate("/my-profile")}
            className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === "processing") {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-[#1a1a1c] rounded-xl shadow-2xl border border-gray-800">
        <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">
          Processing Payment
        </h2>
        <div className="flex flex-col items-center">
          <Loader />
          <p className="mt-4 text-gray-400">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-[#1a1a1c] rounded-xl shadow-2xl border border-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-400"
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
          <h2 className="text-2xl font-bold text-green-400 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-300 mb-6">
            Your premium subscription has been activated.
          </p>
          {premiumStatus?.expiryDate && (
            <p className="text-gray-400 mb-6">
              Your premium access will expire on:{" "}
              <span className="font-semibold text-green-400">
                {new Date(premiumStatus.expiryDate).toLocaleDateString()}
              </span>
            </p>
          )}
          <button
            onClick={() => navigate("/profile")}
            className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-[#1a1a1c] rounded-xl shadow-2xl border border-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-400"
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
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Payment Failed
          </h2>
          <p className="text-gray-300 mb-6">
            We couldn't process your payment. Please try again.
          </p>
          <button
            onClick={() => {
              setPaymentStatus(null);
              window.location.reload();
            }}
            className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <SubNavbar />
      <div className="max-w-md mx-auto my-10 p-6 bg-[#1a1a1c] rounded-xl shadow-2xl border border-gray-800">
        <h2 className="text-2xl font-bold text-gray-200 mb-6 text-center">
          Upgrade to Premium
        </h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-300">
            Select Plan
          </h3>
          <div className="flex space-x-4">
            <div
              className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                selectedPlan === "monthly"
                  ? "border-blue-600 bg-blue-900/30"
                  : "border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setSelectedPlan("monthly")}
            >
              <h4 className="font-bold text-gray-200">Monthly</h4>
              <p className="text-2xl font-bold text-blue-400">Rs 50</p>
              <p className="text-sm text-gray-400">Billed monthly</p>
            </div>
            <div
              className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                selectedPlan === "yearly"
                  ? "border-blue-600 bg-blue-900/30"
                  : "border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setSelectedPlan("yearly")}
            >
              <h4 className="font-bold text-gray-200">Yearly</h4>
              <p className="text-2xl font-bold text-blue-400">Rs 100</p>
              <p className="text-sm text-gray-400">Save 50%</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">
            Premium Benefits
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-400">
            <li>Access to exclusive recipes</li>
            <li>Ad-free experience</li>
            <li>Priority customer support</li>
            <li>Early access to new features</li>
          </ul>
        </div>

        {isProcessing ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <button
            onClick={handleSubscribe}
            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
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
  );
};

export default PremiumSubscription;
