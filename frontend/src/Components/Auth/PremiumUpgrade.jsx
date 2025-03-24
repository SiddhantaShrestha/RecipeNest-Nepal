import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader";

const PremiumUpgrade = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState({
    isPremium: false,
    premiumExpiryDate: null,
  });

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/users/premium/status",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setPremiumStatus({
          isPremium: response.data.isPremium,
          premiumExpiryDate: response.data.premiumExpiryDate,
        });
      } catch (error) {
        console.error("Error checking premium status:", error);
      }
    };

    if (user && user.token) {
      checkPremiumStatus();
    }
  }, [user]);

  const handlePremiumUpgrade = async () => {
    try {
      setIsLoading(true);

      // Generate a unique transaction ID with a consistent format - same approach as in Order.jsx
      const transaction_uuid = `PREMIUM-${Date.now()}`;

      // Follow the same approach as in Order.jsx for payment initiation
      const response = await axios.post(
        "http://localhost:8000/api/esewa/pay", // Use the same endpoint as Order.jsx
        {
          amount: "50", // Premium price
          transaction_uuid: transaction_uuid,
          // We don't need orderId here since this is a premium upgrade
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("eSewa payment response:", response.data);

      if (response.data.formData) {
        // Store transaction info for verification later - using same approach as Order.jsx
        localStorage.setItem("premiumTransactionId", transaction_uuid);
        localStorage.setItem("premiumPaymentAmount", "50");
        localStorage.setItem("premiumPaymentStartTime", Date.now().toString());

        // Create and submit the form to eSewa
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        for (const key in response.data.formData) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = response.data.formData[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);
      toast.error("Payment initiation failed. Please try again.");
      setIsLoading(false);
    }
  };

  // Check for returning from eSewa payment - follow Order.jsx pattern
  useEffect(() => {
    const verifyPayment = async () => {
      const transactionId = localStorage.getItem("premiumTransactionId");
      const paymentAmount = localStorage.getItem("premiumPaymentAmount");

      if (transactionId && paymentAmount) {
        try {
          setIsLoading(true);

          const urlParams = new URLSearchParams(window.location.search);
          const data = urlParams.get("data");
          const status = urlParams.get("status");

          console.log("Payment return data:", { data, status });

          // First check for direct status parameter
          if (status === "COMPLETE" || status === "SUCCESS") {
            await handleSuccessfulPayment(transactionId);
            return;
          }

          // Then try the data parameter if available
          if (data) {
            try {
              // Decode the data parameter - same as Order.jsx
              const decodedData = decodeURIComponent(data);
              const paymentData = JSON.parse(atob(decodedData));

              console.log("Decoded payment data:", paymentData);

              if (
                paymentData.status === "COMPLETE" ||
                paymentData.status === "SUCCESS"
              ) {
                await handleSuccessfulPayment(
                  paymentData.transaction_uuid || transactionId
                );
              } else {
                // Handle payment failure
                toast.error(
                  `Payment failed: ${paymentData.status || "Unknown error"}`
                );
                clearPaymentData();
              }
            } catch (parseError) {
              console.error("Error parsing payment data:", parseError);
              toast.error("Could not verify payment. Please contact support.");
              clearPaymentData();
            }
          } else if (transactionId) {
            // Manual verification as a fallback - similar to Order.jsx
            try {
              const verifyResponse = await axios.post(
                "http://localhost:8000/api/esewa/verify",
                {
                  transaction_uuid: transactionId,
                  amount: paymentAmount,
                }
              );

              console.log("Manual verification response:", verifyResponse.data);

              if (verifyResponse.data.success) {
                await handleSuccessfulPayment(transactionId);
              }
            } catch (verifyError) {
              console.error("Verification error:", verifyError);
              setIsLoading(false);
              // Don't clear payment data yet - might be temporary error
            }
          }
        } catch (error) {
          console.error("Verification error:", error);
          toast.error("Payment verification failed. Please try again.");
          setIsLoading(false);
        }
      }
    };

    // Helper function to handle successful payment
    const handleSuccessfulPayment = async (transactionId) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/users/premium/verify",
          { transaction_uuid: transactionId },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response.data.success) {
          toast.success("Premium upgrade successful!");
          setPremiumStatus({
            isPremium: true,
            premiumExpiryDate: response.data.premiumExpiryDate,
          });
          clearPaymentData();
        }
      } catch (error) {
        console.error("Error completing upgrade:", error);
        toast.error("Upgrade verification failed. Please contact support.");
      } finally {
        setIsLoading(false);
      }
    };

    const clearPaymentData = () => {
      localStorage.removeItem("premiumTransactionId");
      localStorage.removeItem("premiumPaymentAmount");
      localStorage.removeItem("premiumPaymentStartTime");
    };

    verifyPayment();

    // Cleanup on unmount
    return () => {
      const paymentStartTime = localStorage.getItem("premiumPaymentStartTime");
      if (paymentStartTime) {
        const startTime = parseInt(paymentStartTime);
        const currentTime = Date.now();
        // If payment started more than 30 mins ago, clear the data
        if (currentTime - startTime > 30 * 60 * 1000) {
          clearPaymentData();
        }
      }
    };
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Premium Membership
        </h1>

        {isLoading ? (
          <div className="flex justify-center my-8">
            <Loader />
          </div>
        ) : premiumStatus.isPremium ? (
          <div className="bg-green-900 bg-opacity-30 p-6 rounded-lg border border-green-700">
            <h2 className="text-2xl font-semibold text-green-400 mb-2">
              You are a Premium Member!
            </h2>
            <p className="text-gray-300 mb-4">
              Your premium membership is active until:
            </p>
            <p className="text-xl font-bold text-white">
              {new Date(premiumStatus.premiumExpiryDate).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Premium Benefits:
              </h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Exclusive access to premium recipes</li>
                <li>Ad-free browsing experience</li>
                <li>Priority customer support</li>
                <li>Early access to new features</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Upgrade to Premium
            </h2>
            <p className="text-gray-300 mb-6">
              Enhance your RecipeNest experience with a premium membership for
              only Rs 50 per year.
            </p>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-100 mb-3">
                Premium Benefits:
              </h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Exclusive access to premium recipes</li>
                <li>Ad-free browsing experience</li>
                <li>Priority customer support</li>
                <li>Early access to new features</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-5 rounded-lg border border-gray-600 flex justify-between items-center mb-6">
              <div>
                <p className="text-lg text-gray-300">Premium Membership</p>
                <p className="text-2xl font-bold text-white">
                  Rs 50{" "}
                  <span className="text-sm font-normal text-gray-400">
                    / year
                  </span>
                </p>
              </div>
              <button
                onClick={handlePremiumUpgrade}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 flex items-center"
                disabled={isLoading}
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
                Pay with eSewa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumUpgrade;
