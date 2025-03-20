import { apiSlice } from "./apiSlice";
import { ORDERS_URL, ESEWA_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      // Add error handling for common issues
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          message: response.data?.message || "Could not fetch order details",
        };
      },
      // Don't cache order details for too long as they might change
      keepUnusedDataFor: 30, // 30 seconds
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
      // Add custom error handling for payment errors
      transformErrorResponse: (response) => {
        console.error("Payment API error:", response);
        return {
          status: response.status,
          message: response.data?.message || "Payment processing failed",
        };
      },
    }),

    verifyEsewaPayment: builder.mutation({
      query: ({ transaction_uuid, amount }) => ({
        url: `${ESEWA_URL}/verify`,
        method: "POST",
        body: { transaction_uuid, amount },
      }),
    }),

    checkPaymentStatus: builder.query({
      query: ({ transactionId, amount }) => ({
        url: `${ESEWA_URL}/status/${transactionId}?amount=${amount}`,
      }),
      keepUnusedDataFor: 5, // Only cache for 5 seconds
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    getTotalOrders: builder.query({
      query: () => `${ORDERS_URL}/total-orders`,
    }),

    getTotalSales: builder.query({
      query: () => `${ORDERS_URL}/total-sales`,
    }),

    getTotalSalesByDate: builder.query({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
    }),
  }),
});

export const {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useVerifyEsewaPaymentMutation,
  useCheckPaymentStatusQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
} = orderApiSlice;
