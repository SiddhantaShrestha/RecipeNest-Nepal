import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../Loader";
import Message from "../Message";
import Header from "../E-commerce components/Header";
import Product from "../Products/Product";
import { FaStar, FaFire, FaTag, FaShoppingBag } from "react-icons/fa";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <div className="min-h-screen bg-gray-900">
      {!keyword ? (
        <Header />
      ) : (
        <div className="py-6 px-8 bg-gray-800 shadow-lg">
          <Link
            to="/"
            className="text-gray-300 hover:text-pink-500 transition duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : isError ? (
          <div className="max-w-2xl mx-auto mt-8">
            <Message variant="danger">
              {isError?.data?.message || isError.error}
            </Message>
          </div>
        ) : (
          <>
            {/* Enhanced Special Products Section */}
            <div className="relative mb-20 mt-12 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-pink-600 opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute top-40 right-1/4 w-16 h-16 bg-yellow-400 opacity-20 rounded-full blur-xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                  <div className="relative max-w-2xl">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg mr-4">
                        <FaFire className="text-white text-lg" />
                      </div>
                      <span className="uppercase tracking-wider text-sm font-semibold text-pink-400">
                        Premium Collection
                      </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 md:mb-0 relative">
                      <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                        Special Products
                      </span>
                    </h1>

                    <p className="text-gray-300 mt-4 md:mt-6 max-w-2xl text-lg leading-relaxed">
                      Discover our curated collection of premium items,
                      handpicked for exceptional quality and value. Each product
                      has been carefully selected to elevate your experience.
                    </p>
                  </div>

                  <Link
                    to="/shop"
                    className="group bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold rounded-lg py-3 px-8 transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/30 mt-8 md:mt-0 flex items-center"
                  >
                    Browse Shop
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              {data.products.length === 0 ? (
                <div className="text-center py-16 bg-gray-800 bg-opacity-50 rounded-2xl backdrop-blur-sm">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-500 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-gray-400 text-xl mb-4">
                      No products found
                    </p>
                    <Link
                      to="/shop"
                      className="text-pink-500 hover:text-pink-400 font-medium"
                    >
                      View all categories
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Featured Products Grid with Enhanced Product Boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {data.products.map((product) => (
                      <div key={product._id} className="group">
                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl group-hover:shadow-pink-500/20 transition-all duration-300 relative border border-gray-800 group-hover:border-pink-500/30 h-full flex flex-col">
                          {/* Image container with improved styling */}
                          <div className="relative overflow-hidden h-48">
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-30 z-10"></div>
                            <img
                              src={`http://localhost:8000${product.image}`}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Price tag */}
                            <div className="absolute top-0 right-0 bg-gradient-to-l from-pink-600 to-purple-600 text-white py-1 px-4 clip-path-price z-20 font-bold shadow-lg">
                              Rs {product.price}
                            </div>

                            {/* Rating stars in better position */}
                            <div className="absolute bottom-2 left-2 z-20 flex items-center bg-black bg-opacity-50 rounded-full px-2 py-1">
                              <FaStar className="text-yellow-400 mr-1" />
                              <span className="text-white text-sm font-medium">
                                {product.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>

                          {/* Special Tags with improved positioning */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                            {/* New tag for recently added products */}
                            {new Date(product.createdAt) >
                              new Date(
                                Date.now() - 7 * 24 * 60 * 60 * 1000
                              ) && (
                              <div className="flex items-center bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                                <span>NEW</span>
                              </div>
                            )}

                            {/* Top rated tag */}
                            {product.rating >= 4.5 && (
                              <div className="flex items-center space-x-1 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                                <FaStar className="text-yellow-900" />
                                <span>Top Rated</span>
                              </div>
                            )}
                          </div>

                          {/* Content section with improved layout */}
                          <div className="p-4 flex-grow flex flex-col">
                            <Link
                              to={`/product/${product._id}`}
                              className="block"
                            >
                              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-400 transition-colors line-clamp-1">
                                {product.name}
                              </h3>
                            </Link>

                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                              {product.description}
                            </p>

                            {/* Product meta info with nicer layout */}
                            <div className="mt-auto flex flex-wrap gap-2">
                              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-md flex items-center">
                                <FaTag className="mr-1 text-pink-400" />{" "}
                                {product.brand}
                              </span>

                              {product.countInStock > 0 ? (
                                <span className="text-xs bg-green-900/40 text-green-400 px-2 py-1 rounded-md">
                                  In Stock
                                </span>
                              ) : (
                                <span className="text-xs bg-red-900/40 text-red-400 px-2 py-1 rounded-md">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action button with hover effect */}
                          <div className="px-4 pb-4 mt-auto">
                            <Link
                              to={`/product/${product._id}`}
                              className="w-full flex items-center justify-center py-2 px-4 bg-gray-700 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-colors group-hover:shadow-lg group-hover:shadow-pink-500/20"
                            >
                              <FaShoppingBag className="mr-2" />
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {data.products.length > 8 && (
                    <div className="flex justify-center mt-16">
                      <Link
                        to="/shop"
                        className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white bg-gray-800 border border-gray-700 rounded-lg hover:border-pink-500 transition duration-300"
                      >
                        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-gradient-to-r from-pink-600 to-purple-600 rounded-full group-hover:w-full group-hover:h-full"></span>
                        <span className="relative flex items-center">
                          View All Products
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add this custom CSS for the price tag clip-path */}
      <style jsx>{`
        .clip-path-price {
          clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%);
        }
      `}</style>
    </div>
  );
};

export default Home;
