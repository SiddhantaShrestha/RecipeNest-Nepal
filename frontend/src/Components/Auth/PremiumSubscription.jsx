import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";

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
      const transactionId = urlParams.get("transactionId");
      const userId = urlParams.get("userId");
      const dataParam = urlParams.get("data");

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
            "http://localhost:8000/api/premium/verify",
            {
              transaction_uuid: transactionId,
              amount: localStorage.getItem("premiumAmount"),
              userId: userId.split("?")[0], // Remove any additional query params
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

  // Check for payment return
  // In your PremiumSubscription component
  //   useEffect(() => {
  //     const verifyPayment = async () => {
  //       const urlParams = new URLSearchParams(window.location.search);
  //       const paymentStatus = urlParams.get("payment");
  //       const transactionId = urlParams.get("transactionId");
  //       const userId = urlParams.get("userId");

  //       if (paymentStatus === "success" && transactionId && userId) {
  //         try {
  //           setIsProcessing(true);

  //           // Verify payment with backend
  //           const verifyResponse = await axios.post(
  //             "http://localhost:8000/api/premium/verify",
  //             {
  //               transaction_uuid: transactionId,
  //               amount: localStorage.getItem("premiumAmount"),
  //               userId: userId,
  //             },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${authToken}`,
  //               },
  //             }
  //           );

  //           console.log("Verify response:", verifyResponse.data);

  //           // Clear URL parameters
  //           window.history.replaceState({}, document.title, "/premium");

  //           // Clear storage
  //           localStorage.removeItem("premiumTransactionId");
  //           localStorage.removeItem("premiumUserId");
  //           localStorage.removeItem("premiumAmount");
  //           localStorage.removeItem("premiumStartTime");

  //           // Refresh premium status
  //           const statusResponse = await axios.get(
  //             "http://localhost:8000/api/premium/status",
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${authToken}`,
  //               },
  //             }
  //           );
  //           setPremiumStatus(statusResponse.data);

  //           toast.success("Premium subscription activated!");
  //         } catch (error) {
  //           console.error("Payment verification error:", error);
  //           toast.error("Payment verification failed");
  //         } finally {
  //           setIsProcessing(false);
  //         }
  //       } else if (paymentStatus === "failed") {
  //         toast.error("Payment failed. Please try again.");
  //         // Clear URL parameters
  //         window.history.replaceState({}, document.title, "/premium");
  //       }
  //     };

  //     verifyPayment();
  //   }, [authToken]);

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
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Please login to subscribe
        </h2>
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    );
  }

  if (premiumStatus?.isPremium) {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Premium Member
        </h2>
        <p className="mb-4">
          You are already a premium member. Your subscription will expire on{" "}
          {new Date(premiumStatus.expiryDate).toLocaleDateString()}.
        </p>
        <button
          onClick={() => navigate("/profile")}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Go to Profile
        </button>
      </div>
    );
  }
  // Add this right before your final return statement
  if (paymentStatus === "processing") {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          Processing Payment
        </h2>
        <div className="flex flex-col items-center">
          <Loader />
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
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
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-700 mb-6">
            Your premium subscription has been activated.
          </p>
          {premiumStatus?.expiryDate && (
            <p className="text-gray-600 mb-6">
              Your premium access will expire on:{" "}
              <span className="font-semibold">
                {new Date(premiumStatus.expiryDate).toLocaleDateString()}
              </span>
            </p>
          )}
          <button
            onClick={() => navigate("/profile")}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-600"
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
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Payment Failed
          </h2>
          <p className="text-gray-700 mb-6">
            We couldn't process your payment. Please try again.
          </p>
          <button
            onClick={() => {
              setPaymentStatus(null);
              window.location.reload();
            }}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Upgrade to Premium
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Plan</h3>
        <div className="flex space-x-4">
          <div
            className={`flex-1 p-4 border rounded-lg cursor-pointer ${
              selectedPlan === "monthly"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
            onClick={() => setSelectedPlan("monthly")}
          >
            <h4 className="font-bold">Monthly</h4>
            <p className="text-2xl font-bold">Rs 500</p>
            <p className="text-sm text-gray-600">Billed monthly</p>
          </div>
          <div
            className={`flex-1 p-4 border rounded-lg cursor-pointer ${
              selectedPlan === "yearly"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
            onClick={() => setSelectedPlan("yearly")}
          >
            <h4 className="font-bold">Yearly</h4>
            <p className="text-2xl font-bold">Rs 5000</p>
            <p className="text-sm text-gray-600">Save 16%</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Premium Benefits</h3>
        <ul className="list-disc pl-5 space-y-1">
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
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center"
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
  );
};

export default PremiumSubscription;
