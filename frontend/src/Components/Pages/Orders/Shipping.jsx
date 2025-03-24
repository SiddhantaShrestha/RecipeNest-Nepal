import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../../redux/features/cart/cartSlice";
import ProgressSteps from "../../../Components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("ESewa");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="my-8">
          <ProgressSteps step1 step2 />
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8 mb-12">
          <h1 className="text-2xl font-bold text-white mb-6">
            Shipping Details
          </h1>

          <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-gray-300 mb-2 font-medium">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your full address"
                  value={address}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  City
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter city"
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Postal Code
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter postal code"
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-300 mb-2 font-medium">
                  Country
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter country"
                  value={country}
                  required
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-8 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Payment Method
              </h2>
              <div className="bg-gray-700 p-4 rounded-md border border-gray-600">
                <div className="flex items-center">
                  <input
                    id="esewa"
                    type="radio"
                    className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-500"
                    name="paymentMethod"
                    value="ESewa"
                    checked={paymentMethod === "ESewa"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="esewa" className="ml-3 block text-white">
                    ESewa
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-md font-medium transition duration-300 text-lg flex justify-center items-center"
                type="submit"
              >
                Continue to Place Order
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
