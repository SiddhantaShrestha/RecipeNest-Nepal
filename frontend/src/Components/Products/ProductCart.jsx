"use client";

import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { getImageUrl } from "../../redux/constants";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-gray-700 flex flex-col h-full">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <div className="overflow-hidden">
            <img
              className="cursor-pointer w-full transition-transform duration-500 hover:scale-110"
              src={getImageUrl(p.image)}
              alt={p.name}
              style={{ height: "200px", objectFit: "cover" }}
            />
          </div>
          <span className="absolute bottom-3 right-3 bg-pink-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
            {p?.brand}
          </span>
        </Link>
        <div className="absolute top-3 left-3">
          <HeartIcon product={p} />
        </div>
      </section>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h5 className="text-xl font-semibold text-white line-clamp-1">
            {p?.name}
          </h5>
          <p className="text-pink-500 font-bold ml-2">
            {p?.price?.toLocaleString("ne-NP", {
              style: "currency",
              currency: "NPR",
            })}
          </p>
        </div>

        <p className="mb-4 text-gray-400 text-sm line-clamp-2 flex-grow">
          {p?.description?.substring(0, 80)} ...
        </p>

        <section className="flex justify-between items-center mt-auto pt-3 border-t border-gray-800">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            View Details
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors duration-300 shadow-md hover:shadow-lg"
            onClick={() => addToCartHandler(p, 1)}
            aria-label="Add to cart"
          >
            <AiOutlineShoppingCart size={22} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
