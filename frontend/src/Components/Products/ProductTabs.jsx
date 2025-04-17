import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../Loader";
import { FaStar, FaRegStar } from "react-icons/fa";

const ProductTabs = ({
  loadingProductReview,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);
  const [user, setUser] = useState(null);
  const [hover, setHover] = useState(0);

  // Use useEffect to load user from localStorage when component mounts
  useEffect(() => {
    const userAuthToken = localStorage.getItem("authToken") || null;
    setUser(userAuthToken);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Tabs Navigation */}
      <section className="md:w-1/4 mr-6">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div
            className={`p-4 cursor-pointer transition-all duration-200 ${
              activeTab === 1
                ? "bg-pink-600 text-white font-medium"
                : "text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => handleTabClick(1)}
          >
            Write Your Review
          </div>
          <div
            className={`p-4 cursor-pointer transition-all duration-200 ${
              activeTab === 2
                ? "bg-pink-600 text-white font-medium"
                : "text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => handleTabClick(2)}
          >
            All Reviews
          </div>
          <div
            className={`p-4 cursor-pointer transition-all duration-200 ${
              activeTab === 3
                ? "bg-pink-600 text-white font-medium"
                : "text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => handleTabClick(3)}
          >
            Related Products
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="md:w-3/4">
        {/* Write Review Tab */}
        {activeTab === 1 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-white">
              Share Your Thoughts
            </h2>

            {user ? (
              <form onSubmit={submitHandler} className="space-y-6">
                <div>
                  <label
                    htmlFor="rating"
                    className="block text-lg mb-2 text-gray-300"
                  >
                    Rating
                  </label>

                  {/* Interactive Star Rating Component */}
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <div
                          key={index}
                          className="cursor-pointer"
                          onClick={() => setRating(ratingValue)}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(0)}
                        >
                          {ratingValue <= (hover || rating) ? (
                            <FaStar className="text-yellow-400 text-2xl mr-1" />
                          ) : (
                            <FaRegStar className="text-yellow-400 text-2xl mr-1" />
                          )}
                        </div>
                      );
                    })}
                    <span className="ml-3 text-gray-400">
                      {rating === "1" && "Inferior"}
                      {rating === "2" && "Decent"}
                      {rating === "3" && "Great"}
                      {rating === "4" && "Excellent"}
                      {rating === "5" && "Exceptional"}
                    </span>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="comment"
                      className="block text-lg mb-2 text-gray-300"
                    >
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      rows="4"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-pink-500 focus:border-pink-500 transition duration-200"
                      placeholder="Share your experience with this product..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingProductReview}
                    className="mt-4 bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                  >
                    {loadingProductReview ? (
                      <span className="inline-flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-700 p-6 rounded-lg text-center">
                <p className="text-gray-300 mb-4">
                  Please sign in to write a review
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-lg transition duration-300"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        )}

        {/* All Reviews Tab */}
        {activeTab === 2 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-white">
              Customer Reviews
            </h2>

            {product.reviews.length === 0 ? (
              <div className="bg-gray-700 p-6 rounded-lg text-center">
                <p className="text-gray-300">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-gray-700 p-5 rounded-lg border-l-4 border-pink-600"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-lg font-semibold text-white">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-white">
                            {review.name}
                          </h4>
                          <div className="flex items-center mt-1">
                            <Ratings value={review.rating} />
                            <span className="ml-2 text-sm text-gray-400">
                              {review.createdAt.substring(0, 10)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Related Products Tab */}
        {activeTab === 3 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-white">
              You Might Also Like
            </h2>

            {!data ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((product) => (
                  <div key={product._id}>
                    <SmallProduct product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
