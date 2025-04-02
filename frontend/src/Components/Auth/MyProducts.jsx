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
} from "react-icons/fa";
import Pagination from "../Pagination";

const MyProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

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
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <FaCheckCircle className="mr-1" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
            <FaTimesCircle className="mr-1" /> Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
            <FaExclamationCircle className="mr-1" /> Pending
          </span>
        );
    }
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = data?.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = data ? Math.ceil(data.length / productsPerPage) : 0;

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8">
      <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-800 bg-gray-800 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">
              My Product Submissions
            </h1>
            <p className="text-gray-400 mt-1">
              View and manage your product submissions
            </p>
          </div>
          <Link
            to="/product-submission"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Submit New Product
          </Link>
        </div>

        {data?.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4 text-gray-500 text-5xl">
              <FaExclamationCircle className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              No products submitted yet
            </h3>
            <p className="text-gray-400 mb-6">
              You haven't submitted any products for approval yet.
            </p>
            <Link
              to="/submit-product"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Submit Your First Product
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date Submitted
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {currentProducts?.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={`http://localhost:8000${product.image}`}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-400">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          Rs{product.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">
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
                            className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors"
                            title="View"
                          >
                            View
                          </Link>

                          <Link
                            to={`/edit-product/${product._id}`}
                            className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/30 transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>

                          <button
                            onClick={() => handleDelete(product._id)}
                            className="px-2 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-800">
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Submission Status Legend */}
      {data?.length > 0 && (
        <div className="mt-8 bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-800 bg-gray-800 px-6 py-4">
            <h2 className="text-lg font-bold text-white">
              Understanding Product Status
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">{getStatusBadge("pending")}</div>
              <p className="text-gray-300">
                Your product is awaiting admin review. This usually takes 1-2
                business days.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">{getStatusBadge("approved")}</div>
              <p className="text-gray-300">
                Your product has been approved and is now visible to customers
                in the store.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">{getStatusBadge("rejected")}</div>
              <p className="text-gray-300">
                Your product was not approved. Please check the admin feedback,
                make necessary changes, and resubmit.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
