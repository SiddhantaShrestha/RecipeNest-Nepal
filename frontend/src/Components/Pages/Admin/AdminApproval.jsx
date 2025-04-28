import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import {
  useFetchPendingProductsQuery,
  useReviewProductSubmissionMutation,
} from "../../../redux/api/productApiSlice";

const ProductApproval = () => {
  const {
    data: pendingProducts,
    isLoading,
    refetch,
  } = useFetchPendingProductsQuery();
  const [reviewProduct] = useReviewProductSubmissionMutation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);

  const handleApprove = async (productId) => {
    try {
      await reviewProduct({
        productId, // The parameter name should match what your backend expects
        approvalStatus: "approved",
        adminFeedback: feedback,
        rating: rating,
      }).unwrap();

      toast.success("Product approved successfully");
      setSelectedProduct(null);
      setFeedback("");
      setRating(5);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error.data?.error || "Failed to approve product");
    }
  };

  const handleReject = async (productId) => {
    if (!feedback.trim()) {
      return toast.error("Please provide feedback for rejection");
    }

    try {
      await reviewProduct({
        productId, // The parameter name should match what your backend expects
        approvalStatus: "rejected",
        adminFeedback: feedback,
        rating: rating,
      }).unwrap();

      toast.success("Product rejected with feedback");
      setSelectedProduct(null);
      setFeedback("");
      setRating(5);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error.data?.error || "Failed to reject product");
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="md:hidden">
        <AdminMenu />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <AdminMenu />
        </div>

        <div className="lg:w-3/4 bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-800 bg-gray-800 px-6 py-4">
            <h1 className="text-xl font-bold text-white">
              Product Approval Queue
            </h1>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-gray-400">
              Loading pending products...
            </div>
          ) : !pendingProducts || pendingProducts.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No products pending approval
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {pendingProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Product Image */}
                      <div className="p-4">
                        <img
                          src={`http://localhost:8000${product.image}`}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="p-4 md:col-span-2">
                        <h2 className="text-xl font-semibold text-white mb-2">
                          {product.name}
                        </h2>
                        <p className="text-gray-400 mb-2">
                          <span className="font-medium text-gray-300">
                            Submitted by:
                          </span>{" "}
                          {product.submittedBy.username}
                        </p>
                        <p className="text-gray-400 mb-2">
                          <span className="font-medium text-gray-300">
                            Brand:
                          </span>{" "}
                          {product.brand}
                        </p>
                        <p className="text-gray-400 mb-2">
                          <span className="font-medium text-gray-300">
                            Price:
                          </span>{" "}
                          ${product.price}
                        </p>
                        <p className="text-gray-400 mb-2">
                          <span className="font-medium text-gray-300">
                            Category:
                          </span>{" "}
                          {product.category.name}
                        </p>
                        <p className="text-gray-400 mb-2">
                          <span className="font-medium text-gray-300">
                            Description:
                          </span>
                        </p>
                        <p className="text-gray-400 mb-4">
                          {product.description}
                        </p>
                        <p className="text-gray-400 mb-2">
                          <span className="font-medium text-gray-300">
                            Stock:
                          </span>
                        </p>
                        <p className="text-gray-400 mb-4">
                          {product.countInStock}
                        </p>

                        {selectedProduct === product._id ? (
                          <div className="space-y-4">
                            <textarea
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              placeholder="Provide feedback (required for rejection)"
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              rows={3}
                            />

                            <div className="mb-3">
                              <label className="block text-gray-300 mb-1">
                                Rating (for approved products):
                              </label>
                              <select
                                value={rating}
                                onChange={(e) =>
                                  setRating(Number(e.target.value))
                                }
                                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              >
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Very Good</option>
                                <option value="3">3 - Good</option>
                                <option value="2">2 - Fair</option>
                                <option value="1">1 - Poor</option>
                              </select>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              <button
                                onClick={() => handleApprove(product._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(product._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedProduct(null);
                                  setFeedback("");
                                  setRating(5);
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedProduct(product._id)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Review Submission
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductApproval;
