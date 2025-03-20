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
    <Loader />
  ) : error ? (
    <Messsage variant="danger">
      {error.data?.message || "Error loading order"}
    </Messsage>
  ) : (
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={`http://localhost:8000${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>

                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>

                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">{item.price}</td>
                      <td className="p-2 text-center">
                        $ {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.user.username}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong>{" "}
            {order.paymentMethod}
          </p>

          {order.isPaid ? (
            <Messsage variant="success">Paid on {order.paidAt}</Messsage>
          ) : (
            <Messsage variant="danger">Not paid</Messsage>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>$ {order.itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>$ {order.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>$ {order.taxPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>$ {order.totalPrice}</span>
        </div>

        {!order.isPaid && (
          <div>
            {loadingPay && <Loader />}
            {isProcessing ? (
              <Loader />
            ) : (
              <div>
                <button
                  onClick={handleEsewaPayment}
                  className="bg-green-500 hover:bg-green-600 text-white w-full py-2 mt-4 rounded transition duration-300"
                  disabled={isProcessing}
                >
                  Pay with eSewa
                </button>
              </div>
            )}
          </div>
        )}

        {loadingDeliver && <Loader />}
        {user && user.isAdmin && order.isPaid && !order.isDelivered && (
          <div>
            <button
              type="button"
              className="bg-pink-500 text-white w-full py-2"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
