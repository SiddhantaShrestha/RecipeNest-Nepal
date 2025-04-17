import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useFetchUserSubmittedProductsQuery,
  useDeleteProductMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../Loader";
import {
  FaEdit,
  FaTrash,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaCommentAlt,
  FaStar,
} from "react-icons/fa";
import Pagination from "../Pagination";
import SubNavbar from "../SubNavbar";

const MyProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [expandedReview, setExpandedReview] = useState(null);

  const { data, isLoading, refetch } = useFetchUserSubmittedProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success("Product removed successfully");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  // Get status badge based on approval status
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-900/50 text-emerald-300">
            <FaCheckCircle className="mr-1" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-900/50 text-red-300">
            <FaTimesCircle className="mr-1" /> Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300">
            <FaExclamationCircle className="mr-1" /> Pending
          </span>
        );
    }
  };

  // Find admin review in product's reviews array
  const getAdminReview = (product) => {
    if (!product.reviews || product.reviews.length === 0) return null;
    return product.reviews.find((review) => review.name === "Admin");
  };

  // Render star rating
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? "text-yellow-400" : "text-gray-500"}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = data?.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = data ? Math.ceil(data.length / productsPerPage) : 0;

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <SubNavbar />

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl mb-8 text-center font-bold text-emerald-400 border-b border-gray-700 pb-4">
          My Product Submissions
        </h2>

        <div className="flex justify-end mb-6">
          <Link
            to="/product-submission"
            className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Submit New Product
          </Link>
        </div>

        {data?.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="mb-4 text-gray-500 text-5xl">
              <FaExclamationCircle className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No products submitted yet
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              You haven't submitted any products for approval yet.
            </p>
            <Link
              to="/product-submission"
              className="py-3 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-200 inline-flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Submit Your First Product
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                        Date Submitted
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-emerald-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {currentProducts?.map((product) => {
                      const adminReview = getAdminReview(product);
                      return (
                        <>
                          <tr
                            key={product._id}
                            className="hover:bg-gray-800/50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-12 w-12 flex-shrink-0 border border-gray-600 rounded-md overflow-hidden">
                                  <img
                                    className="h-12 w-12 object-cover"
                                    src={`http://localhost:8000${product.image}`}
                                    alt={product.name}
                                    onError={(e) =>
                                      (e.target.src =
                                        "https://via.placeholder.com/100?text=Product")
                                    }
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-white">
                                    {product.name}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {product.brand}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(product.approvalStatus)}
                              {product.adminFeedback &&
                                product.approvalStatus === "rejected" && (
                                  <div className="mt-1 text-xs text-red-400">
                                    Feedback: {product.adminFeedback}
                                  </div>
                                )}
                              {adminReview && (
                                <button
                                  onClick={() =>
                                    setExpandedReview(
                                      expandedReview === product._id
                                        ? null
                                        : product._id
                                    )
                                  }
                                  className="mt-2 inline-flex items-center text-xs text-emerald-400 hover:text-emerald-300"
                                >
                                  <FaCommentAlt className="mr-1" />
                                  {expandedReview === product._id
                                    ? "Hide"
                                    : "Show"}{" "}
                                  Admin Review
                                </button>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">
                                Rs{product.price.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-400">
                                Qty: {product.quantity}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {new Date(product.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Link
                                  to={`/product/${product._id}`}
                                  className="p-1.5 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors flex items-center"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    ></path>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    ></path>
                                  </svg>
                                </Link>

                                {/* Only show Edit button for pending or rejected products */}
                                {product.approvalStatus !== "approved" && (
                                  <Link
                                    to={`/edit-product/${product._id}`}
                                    className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors flex items-center"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      ></path>
                                    </svg>
                                  </Link>
                                )}

                                {/* Only show Delete button for pending or rejected products */}
                                {product.approvalStatus !== "approved" && (
                                  <button
                                    onClick={() => handleDelete(product._id)}
                                    className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      ></path>
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                          {/* Expanded admin review row */}
                          {expandedReview === product._id && adminReview && (
                            <tr className="bg-gray-800/30">
                              <td colSpan="5" className="px-6 py-4">
                                <div className="bg-gray-800 rounded-lg p-4 border border-emerald-900/50">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-white font-medium">
                                      Admin Review
                                    </h4>
                                    <div>
                                      {renderStarRating(adminReview.rating)}
                                    </div>
                                  </div>
                                  <p className="text-gray-300">
                                    {adminReview.comment}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-700">
                  <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                  />
                </div>
              )}
            </div>

            {/* Submission Status Legend */}
            <div className="mt-8 bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
              <div className="border-b border-gray-700 px-6 py-4">
                <h2 className="text-lg font-bold text-emerald-400">
                  Understanding Product Status
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getStatusBadge("pending")}
                  </div>
                  <p className="text-gray-300">
                    Your product is awaiting admin review. This usually takes
                    1-2 business days.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getStatusBadge("approved")}
                  </div>
                  <p className="text-gray-300">
                    Your product has been approved and is now visible to
                    customers in the store. Approved products cannot be edited
                    or deleted. Click "Show Admin Review" to see the admin's
                    rating and comments.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getStatusBadge("rejected")}
                  </div>
                  <p className="text-gray-300">
                    Your product was not approved. Please check the admin
                    feedback, make necessary changes, and resubmit.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
