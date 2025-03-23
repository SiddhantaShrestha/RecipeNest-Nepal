import { Link } from "react-router-dom";
import moment from "moment";
import {
  useAllProductsQuery,
  useDeleteProductMutation,
} from "../../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";
import { useState } from "react";

const AllProducts = () => {
  const { data: products, isLoading, isError, refetch } = useAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (productId, productName) => {
    try {
      const answer = window.confirm(
        `Are you sure you want to delete "${productName}"?`
      );

      if (!answer) return;

      setDeleting(true);
      await deleteProduct(productId).unwrap();
      toast.success(`"${productName}" has been deleted`);
      refetch(); // Refresh the products list
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading || deleting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-900 text-white p-4 rounded-lg shadow-lg">
          Error loading products. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Admin Menu - Moved to left side for better UX */}
        <div className="lg:w-1/4 order-2 lg:order-1">
          <div className="sticky top-4">
            <AdminMenu />
          </div>
        </div>

        {/* Products Section */}
        <div className="lg:w-3/4 order-1 lg:order-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              All Products{" "}
              <span className="text-pink-500">({products.length})</span>
            </h1>

            <Link
              to="/admin/productlist"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center gap-2"
            >
              <span>Add Product</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-pink-500/10 transition-all duration-300 border border-gray-700 hover:border-pink-500/50"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 relative overflow-hidden">
                    <img
                      src={`http://localhost:8000${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover md:h-48 lg:h-56"
                    />
                    <div className="absolute top-2 right-2 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Rs {product?.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-5 md:w-3/4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-bold text-white">
                          {product?.name}
                        </h2>
                        <span className="text-gray-400 text-xs">
                          {moment(product.createdAt).format("MMM D, YYYY")}
                        </span>
                      </div>

                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {product?.description?.substring(0, 160)}
                        {product?.description?.length > 160 && "..."}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition duration-300"
                        >
                          Edit
                          <svg
                            className="w-4 h-4 ml-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(product._id, product.name)
                          }
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300"
                          aria-label="Delete product"
                        >
                          Delete
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-300 text-sm">In Stock:</span>
                        <span
                          className={`font-medium ${
                            product.countInStock > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {product.countInStock > 0
                            ? product.countInStock
                            : "Out of stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
