import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../../Components/Message";
import ProgressSteps from "../../../Components/ProgressSteps";
import Loader from "../../../Components/Loader";
import { useCreateOrderMutation } from "../../../redux/api/orderApiSlice";
import { clearCartItems } from "../../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="my-8">
          <ProgressSteps step1 step2 step3 />
        </div>

        {cart.cartItems.length === 0 ? (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center shadow-lg">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-6">
              Add some products to your cart to proceed with checkout.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-md font-medium transition duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Order Items</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-700">
                    {cart.cartItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <img
                            src={`http://localhost:8000${item.image}`}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/product/${item.product}`}
                            className="text-amber-500 hover:text-amber-400 font-medium"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-white">{item.qty}</td>
                        <td className="px-6 py-4 text-white">
                          Rs {item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 font-medium text-white">
                          Rs {(item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 text-lg">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                    <span className="text-gray-300">Items:</span>
                    <span className="font-medium text-white">
                      Rs {cart.itemsPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                    <span className="text-gray-300">Shipping:</span>
                    <span className="font-medium text-white">
                      Rs {cart.shippingPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                    <span className="text-gray-300">Tax:</span>
                    <span className="font-medium text-white">
                      Rs {cart.taxPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-white">Total:</span>
                    <span className="font-bold text-xl text-amber-500">
                      Rs {cart.totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Shipping Details
                  </h2>
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <span className="text-gray-400">Address:</span>{" "}
                      {cart.shippingAddress.address}
                    </p>
                    <p>
                      <span className="text-gray-400">City:</span>{" "}
                      {cart.shippingAddress.city}
                    </p>
                    <p>
                      <span className="text-gray-400">Postal Code:</span>{" "}
                      {cart.shippingAddress.postalCode}
                    </p>
                    <p>
                      <span className="text-gray-400">Country:</span>{" "}
                      {cart.shippingAddress.country}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Payment Method
                  </h2>
                  <div className="flex items-center">
                    {cart.paymentMethod === "ESewa" ? (
                      <div className="bg-green-500 rounded-full p-2 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="bg-blue-500 rounded-full p-2 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                    )}
                    <span className="text-white">{cart.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6">
                <Message variant="danger">{error.data.message}</Message>
              </div>
            )}

            <div className="mt-8">
              <button
                type="button"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 px-6 rounded-md font-medium transition duration-300 text-lg flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cart.cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
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
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Order
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;
