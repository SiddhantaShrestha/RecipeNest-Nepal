import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../Loader";
import Message from "../Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaArrowLeft,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-gray-300 hover:text-pink-500 transition duration-300"
          >
            <FaArrowLeft className="mr-2" />
            <span className="font-medium">Back to Products</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto mt-8">
            <Message variant="danger">
              {error?.data?.message || error.message}
            </Message>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Product Image Section */}
            <div className="lg:w-1/2 relative">
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute top-4 right-4">
                <HeartIcon product={product} />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="lg:w-1/2">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg h-full">
                <div className="flex flex-col h-full">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {product.name}
                  </h1>

                  <div className="mb-4">
                    <Ratings
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />
                  </div>

                  <div className="mb-6 border-b border-gray-700 pb-6">
                    <p className="text-4xl font-bold text-pink-500">
                      Rs {product.price}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>

                  <div className="prose prose-sm text-gray-300 mb-6 border-b border-gray-700 pb-6">
                    <p>{product.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 border-b border-gray-700 pb-6">
                    <div className="flex items-center text-gray-300">
                      <FaStore className="mr-2 text-pink-500" />
                      <span className="font-medium">Brand:</span>
                      <span className="ml-2">{product.brand}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaBox className="mr-2 text-pink-500" />
                      <span className="font-medium">In Stock:</span>
                      <span className="ml-2">{product.countInStock}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaShoppingCart className="mr-2 text-pink-500" />
                      <span className="font-medium">Quantity:</span>
                      <span className="ml-2">{product.quantity}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaClock className="mr-2 text-pink-500" />
                      <span className="font-medium">Added:</span>
                      <span className="ml-2">
                        {moment(product.createAt).fromNow()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex flex-wrap items-center gap-4">
                      {product.countInStock > 0 && (
                        <div className="flex items-center">
                          <label
                            htmlFor="quantity"
                            className="mr-3 text-gray-300 font-medium"
                          >
                            Qty:
                          </label>
                          <select
                            id="quantity"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:ring-pink-500 focus:border-pink-500"
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      )}

                      <button
                        onClick={addToCartHandler}
                        disabled={product.countInStock === 0}
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition duration-300 ${
                          product.countInStock === 0
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-pink-600 hover:bg-pink-700 text-white hover:shadow-lg hover:shadow-pink-500/30"
                        }`}
                      >
                        {product.countInStock === 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Tabs Section */}
        {!isLoading && !error && (
          <div className="mt-12">
            <div className="bg-gray-800 rounded-lg shadow-lg">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
