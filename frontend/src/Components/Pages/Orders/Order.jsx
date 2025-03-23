import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import Messsage from "../../../Components/Message";
import Loader from "../../../Components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  // Fix: Access user data with better error handling
  const auth = useSelector((state) => state.auth);
  const user = auth?.user || {};

  // Debug the user data when component mounts
  useEffect(() => {
    console.log("Current auth state:", auth);
    console.log("User data in Order component:", user);
  }, [auth, user]);

  // Handle eSewa payment
  const handleEsewaPayment = async () => {
    try {
      setIsProcessing(true);

      // Generate a unique transaction ID with a consistent format
      const transaction_uuid = `ESEWA-${orderId}-${Date.now()}`;

      console.log("Initiating eSewa payment:", {
        orderId,
        amount: order.totalPrice.toString(),
        transaction_uuid,
      });

      const response = await axios.post("http://localhost:8000/api/esewa/pay", {
        amount: order.totalPrice.toString(),
        transaction_uuid: transaction_uuid,
        orderId: orderId, // Pass the orderId explicitly
      });

      console.log("eSewa payment response:", response.data);

      if (response.data.formData) {
        // Store the order ID and transaction ID in localStorage for verification later
        localStorage.setItem("currentOrderId", orderId);
        localStorage.setItem("currentTransactionId", transaction_uuid);
        localStorage.setItem("paymentAmount", order.totalPrice.toString());
        localStorage.setItem("paymentStartTime", Date.now().toString());

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
      setIsProcessing(false);
    }
  };

  // Add effect to check payment status on component mount
  // This is useful when user gets redirected back from eSewa
  useEffect(() => {
    const verifyPayment = async () => {
      const storedOrderId = localStorage.getItem("currentOrderId");
      const storedTransactionId = localStorage.getItem("currentTransactionId");
      const paymentAmount = localStorage.getItem("paymentAmount");

      console.log("Checking payment status:", {
        storedOrderId,
        currentOrderId: orderId,
        storedTransactionId,
        isPaid: order?.isPaid,
        urlParams: window.location.search,
      });

      // Check if we're returning from eSewa and this is the order we were paying for
      if (storedOrderId === orderId && storedTransactionId && !order?.isPaid) {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const data = urlParams.get("data");
          const status = urlParams.get("status"); // Some payment gateways return status directly

          console.log("Payment return data:", { data, status });

          // First check for direct status parameter
          if (status === "COMPLETE" || status === "SUCCESS") {
            await handleSuccessfulPayment(storedTransactionId);
            return;
          }

          // Then try the data parameter if available
          if (data) {
            try {
              // Decode the data parameter
              const decodedData = decodeURIComponent(data);
              const paymentData = JSON.parse(atob(decodedData));

              console.log("Decoded payment data:", paymentData);

              if (
                paymentData.status === "COMPLETE" ||
                paymentData.status === "SUCCESS"
              ) {
                await handleSuccessfulPayment(
                  paymentData.transaction_uuid || storedTransactionId
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
            }
          } else if (
            location.pathname.includes(`/order/${orderId}`) &&
            storedTransactionId
          ) {
            try {
              const verifyResponse = await axios.post(
                "http://localhost:8000/api/esewa/verify",
                {
                  transaction_uuid: storedTransactionId,
                  amount: paymentAmount,
                }
              );

              console.log("Manual verification response:", verifyResponse.data);

              if (verifyResponse.data.success) {
                await handleSuccessfulPayment(storedTransactionId);
              }
            } catch (verifyError) {
              console.error("Verification error:", verifyError);
              // Don't clear payment data yet - might be temporary error
            }
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Payment verification failed. Please contact support.");
        }
      }
    };

    // Helper function to handle successful payment
    const handleSuccessfulPayment = async (transactionId) => {
      try {
        await payOrder({
          orderId,
          details: {
            id: transactionId,
            status: "COMPLETED",
            update_time: new Date().toISOString(),
            payer: {
              email_address: order?.user?.email || "customer@example.com",
            },
          },
        });

        // Clear the localStorage
        clearPaymentData();

        refetch();
        toast.success("Payment successful!");
      } catch (error) {
        console.error("Error updating order payment status:", error);
        toast.error(
          "Payment recorded but order update failed. Please contact support."
        );
      }
    };

    // Helper function to clear payment data
    const clearPaymentData = () => {
      localStorage.removeItem("currentOrderId");
      localStorage.removeItem("currentTransactionId");
      localStorage.removeItem("paymentAmount");
      localStorage.removeItem("paymentStartTime");
    };

    if (order && !order.isPaid) {
      verifyPayment();
    }
  }, [order, orderId, payOrder, refetch, location]);

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (error) {
      toast.error("Failed to update delivery status");
    }
  };

  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      // Check if payment has been in process for over 30 minutes and clean up if so
      const paymentStartTime = localStorage.getItem("paymentStartTime");
      if (paymentStartTime) {
        const startTime = parseInt(paymentStartTime);
        const currentTime = Date.now();
        // If payment started more than 30 mins ago, clear the data
        if (currentTime - startTime > 30 * 60 * 1000) {
          localStorage.removeItem("currentOrderId");
          localStorage.removeItem("currentTransactionId");
          localStorage.removeItem("paymentAmount");
          localStorage.removeItem("paymentStartTime");
        }
      }
    };
  }, []);

  return isLoading ? (
    <div className="flex justify-center items-center min-h-screen">
      <Loader />
    </div>
  ) : error ? (
    <div className="container mx-auto px-4 py-8">
      <Messsage variant="danger">
        {error.data?.message || "Error loading order"}
      </Messsage>
    </div>
  ) : (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-4 flex items-center">
          <span className="text-indigo-400 mr-2">Order</span> #{order._id}
          {order.isPaid ? (
            <span className="ml-4 px-3 py-1 text-xs font-semibold rounded-full bg-green-600 text-green-100">
              Paid
            </span>
          ) : (
            <span className="ml-4 px-3 py-1 text-xs font-semibold rounded-full bg-red-600 text-red-100">
              Not Paid
            </span>
          )}
          {order.isDelivered ? (
            <span className="ml-2 px-3 py-1 text-xs font-semibold rounded-full bg-green-600 text-green-100">
              Delivered
            </span>
          ) : (
            <span className="ml-2 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-600 text-yellow-100">
              Not Delivered
            </span>
          )}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Items Section */}
          <div className="md:col-span-2">
            <div className="bg-gray-900 rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-xl font-bold text-gray-100 mb-4 border-b border-gray-700 pb-2">
                Order Items
              </h2>

              {order.orderItems.length === 0 ? (
                <Messsage>Order is empty</Messsage>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800 text-gray-300 text-sm uppercase">
                      <tr>
                        <th className="py-3 px-4 text-left">Product</th>
                        <th className="py-3 px-4 text-center">Qty</th>
                        <th className="py-3 px-4 text-right">Price</th>
                        <th className="py-3 px-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {order.orderItems.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-800">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <img
                                src={`http://localhost:8000${item.image}`}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded mr-4"
                              />
                              <Link
                                to={`/product/${item.product}`}
                                className="text-indigo-400 hover:text-indigo-300 transition-colors"
                              >
                                {item.name}
                              </Link>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">{item.qty}</td>
                          <td className="py-3 px-4 text-right">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            ${(item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-xl font-bold text-gray-100 mb-4 border-b border-gray-700 pb-2">
                Shipping Details
              </h2>

              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span>{order.user.username}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-indigo-300">{order.user.email}</span>
                </div>

                <div>
                  <span className="text-gray-400">Address:</span>
                  <p className="mt-1">
                    {order.shippingAddress.address},<br />
                    {order.shippingAddress.city}{" "}
                    {order.shippingAddress.postalCode},<br />
                    {order.shippingAddress.country}
                  </p>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-gray-400">Payment Method:</span>
                  <span>{order.paymentMethod}</span>
                </div>

                {order.isPaid ? (
                  <div className="bg-green-900 bg-opacity-30 text-green-400 p-3 rounded mt-3">
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="bg-red-900 bg-opacity-30 text-red-400 p-3 rounded mt-3">
                    Not paid
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold text-gray-100 mb-4 border-b border-gray-700 pb-2">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Items</span>
                  <span>${order.itemsPrice}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>${order.shippingPrice}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>${order.taxPrice}</span>
                </div>

                <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-gray-700">
                  <span>Total</span>
                  <span>${order.totalPrice}</span>
                </div>

                {!order.isPaid && (
                  <div className="mt-4">
                    {loadingPay && <Loader />}
                    {isProcessing ? (
                      <div className="flex justify-center my-4">
                        <Loader />
                      </div>
                    ) : (
                      <button
                        onClick={handleEsewaPayment}
                        className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-md font-medium transition duration-300 flex items-center justify-center"
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
                        Pay with eSewa
                      </button>
                    )}
                  </div>
                )}

                {loadingDeliver && <Loader />}
                {user && user.isAdmin && order.isPaid && !order.isDelivered && (
                  <div className="mt-4">
                    <button
                      type="button"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded-md font-medium transition duration-300"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
