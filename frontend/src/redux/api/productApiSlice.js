import { PRODUCT_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: `${PRODUCT_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Products"],
    }),

    getProductById: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    allProducts: builder.query({
      query: () => `${PRODUCT_URL}/allproducts`,
      providesTags: ["Products"],
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCT_URL}/admin/create`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    // New endpoint for user product submission
    submitProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCT_URL}/submit`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["UserSubmissions"],
    }),

    // For fetching user's submitted products
    fetchUserSubmittedProducts: builder.query({
      query: () => `${PRODUCT_URL}/my-submissions`,
      providesTags: ["UserSubmissions"],
    }),

    // For admin to fetch pending product submissions
    fetchPendingProducts: builder.query({
      query: () => `${PRODUCT_URL}/admin/pending`,
      providesTags: ["PendingProducts"],
    }),

    // For admin to review (approve/reject) product submissions
    reviewProductSubmission: builder.mutation({
      query: ({ productId, approvalStatus, adminFeedback, rating }) => ({
        url: `${PRODUCT_URL}/admin/review/${productId}`,
        method: "PUT",
        body: {
          approvalStatus,
          adminFeedback,
          rating: rating || 5, // Default rating if not provided
        },
      }),
      invalidatesTags: ["PendingProducts", "Products", "UserSubmissions"],
      transformErrorResponse: (response) => {
        return response.data?.error || "Failed to review product";
      },
    }),

    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        "Products",
        "UserSubmissions",
        { type: "Product", id: productId },
      ],
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "UserSubmissions"],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    getTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/top`,
      keepUnusedDataFor: 5,
    }),

    getNewProducts: builder.query({
      query: () => `${PRODUCT_URL}/new`,
      keepUnusedDataFor: 5,
    }),

    getFilteredProducts: builder.query({
      query: ({ checked, radio }) => ({
        url: `${PRODUCT_URL}/filtered-products`,
        method: "POST",
        body: { checked, radio },
      }),
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
  useGetFilteredProductsQuery,
  // Export new hooks
  useSubmitProductMutation,
  useFetchUserSubmittedProductsQuery,
  useFetchPendingProductsQuery,
  useReviewProductSubmissionMutation,
} = productApiSlice;
