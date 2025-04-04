import { apiSlice } from "../api/apiSlice";
import { BASE_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: `${BASE_URL}/api/users`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [
              { type: "User", id: "LIST" },
              ...result.map((user) => ({ type: "User", id: user._id })),
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    getUserById: builder.query({
      query: (userId) => ({
        url: `${BASE_URL}/api/users/${userId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),
    getMyProfile: builder.query({
      query: () => ({
        url: `${BASE_URL}/api/users/my-profile`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Profile"],
    }),
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: `${BASE_URL}/api/users/${userId}`,
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
        "Profile",
      ],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${BASE_URL}/api/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    getUserProductSales: builder.query({
      query: () => ({
        url: "/api/user-sales/product-sales",
      }),
      keepUnusedDataFor: 5,
    }),

    getUserSalesMetrics: builder.query({
      query: () => ({
        url: "/api/user-sales/sales-metrics",
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetMyProfileQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserProductSalesQuery,
  useGetUserSalesMetricsQuery,
} = userApiSlice;
