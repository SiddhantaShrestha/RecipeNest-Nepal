import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaShoppingCart, FaArrowRight } from "react-icons/fa";
import { addToCart, removeFromCart } from "../../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  // Update your selector to access the auth state correctly
  const { isAuthenticated } = useSelector((state) => state.auth);

  const checkoutHandler = () => {
    if (isAuthenticated) {
      // User is already logged in, go directly to shipping
      navigate("/shipping");
    } else {
      // User is not logged in, redirect to login with return URL
      navigate("/login?redirect=/shipping");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
          <FaShoppingCart className="mr-3 text-pink-500" />
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-lg p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
            </div>
            <p className="text-xl text-gray-300 mb-6">Your cart is empty</p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-pink-500/30"
            >
              Continue Shopping
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-lg font-semibold text-white">
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>
                </div>

                <div className="divide-y divide-gray-700">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="p-6 flex flex-col sm:flex-row sm:items-center hover:bg-gray-750"
                    >
                      <div className="w-full sm:w-20 h-20 mb-4 sm:mb-0 flex-shrink-0">
                        <img
                          src={`http://localhost:8000${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md shadow-md"
                        />
                      </div>

                      <div className="flex-1 sm:ml-6">
                        <Link
                          to={`/product/${item._id}`}
                          className="text-lg font-medium text-white hover:text-pink-500 transition duration-200"
                        >
                          {item.name}
                        </Link>

                        <div className="text-sm text-gray-400 mt-1">
                          {item.brand}
                        </div>
                        <div className="text-lg font-bold text-pink-500 mt-2">
                          Rs {item.price}
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center justify-between mt-4 sm:mt-0 sm:items-end">
                        <div className="w-24">
                          <select
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                            value={item.qty}
                            onChange={(e) =>
                              addToCartHandler(item, Number(e.target.value))
                            }
                          >
                            {[...Array(item.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={() => removeFromCartHandler(item._id)}
                          className="text-gray-400 hover:text-red-500 transition duration-200 p-2 rounded-full hover:bg-gray-700 sm:mt-4"
                          aria-label="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/shop"
                  className="inline-flex items-center text-gray-300 hover:text-white transition duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-4 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>
                      Items (
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)})
                    </span>
                    <span>
                      Rs{" "}
                      {cartItems
                        .reduce((acc, item) => acc + item.qty * item.price, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mb-6">
                  <div className="flex justify-between font-bold text-xl">
                    <span className="text-white">Total</span>
                    <span className="text-pink-500">
                      Rs{" "}
                      {cartItems
                        .reduce((acc, item) => acc + item.qty * item.price, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center shadow-lg hover:shadow-pink-500/30"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
