import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { getImageUrl } from "../../redux/constants";

// Custom arrow components for better styling
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "rgba(139, 94, 52, 0.8)",
        borderRadius: "50%",
        padding: "8px",
        zIndex: 1,
        right: "10px",
      }}
      onClick={onClick}
    >
      <FaArrowRight className="text-white" />
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "rgba(139, 94, 52, 0.8)",
        borderRadius: "50%",
        padding: "8px",
        zIndex: 1,
        left: "10px",
      }}
      onClick={onClick}
    >
      <FaArrowLeft className="text-white" />
    </div>
  );
};

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const sliderRef = useRef(null);

  // Ensure autoplay starts and restarts when needed
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickPlay();
    }

    // Restart autoplay if window is refocused
    const handleFocus = () => {
      if (sliderRef.current) {
        sliderRef.current.slickPlay();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [products]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: false, // Changed to false to ensure continuous rotation
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots custom-dots",
    appendDots: (dots) => (
      <div
        style={{
          padding: "10px",
          bottom: "10px",
          position: "absolute",
        }}
      >
        <ul style={{ margin: "0px" }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "12px",
          height: "12px",
          border: "1px solid #8b5e34",
          borderRadius: "50%",
          backgroundColor: "rgba(139, 94, 52, 0.5)",
        }}
      />
    ),
  };

  if (isLoading)
    return (
      <div className="flex justify-center mt-8 mb-8">
        <div className="w-12 h-12 border-4 border-t-4 border-t-[#8b5e34] rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="mb-8 relative overflow-hidden rounded-xl shadow-lg">
      {error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="xl:w-[50rem] lg:w-[50rem] md:w-[56rem] sm:w-full relative">
          <Slider ref={sliderRef} {...settings}>
            {products?.map(
              ({
                image,
                _id,
                name,
                price,
                description,
                brand,
                createdAt,
                numReviews,
                rating,
                quantity,
                countInStock,
              }) => (
                <div key={_id} className="relative">
                  <div className="relative h-[30rem] overflow-hidden">
                    <img
                      src={getImageUrl(image)}
                      alt={name}
                      className="w-full object-cover h-full transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute top-0 left-0 bg-[#8b5e34] text-white px-4 py-2 rounded-br-lg">
                      Rs {price}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
                    <Link
                      to={`/product/${_id}`}
                      className="hover:text-[#d9e85e] transition-colors"
                    >
                      <h2 className="text-2xl font-bold mb-2">{name}</h2>
                    </Link>

                    <p className="mb-4 line-clamp-2">{description}</p>

                    <div className="flex justify-between flex-wrap gap-4">
                      <div className="flex flex-col space-y-2">
                        <span className="flex items-center">
                          <FaStore className="mr-2 text-[#d9e85e]" />
                          <span className="text-sm text-gray-300">
                            Brand:
                          </span>{" "}
                          {brand}
                        </span>
                        <span className="flex items-center">
                          <FaClock className="mr-2 text-[#d9e85e]" />
                          <span className="text-sm text-gray-300">
                            Added:
                          </span>{" "}
                          {moment(createdAt).fromNow()}
                        </span>
                        <span className="flex items-center">
                          <FaStar className="mr-2 text-[#d9e85e]" />
                          <span className="text-sm text-gray-300">
                            Rating:
                          </span>{" "}
                          {rating.toFixed(1)}/5
                        </span>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <span className="flex items-center">
                          <FaStar className="mr-2 text-[#d9e85e]" />
                          <span className="text-sm text-gray-300">
                            Reviews:
                          </span>{" "}
                          {numReviews}
                        </span>
                        <span className="flex items-center">
                          <FaShoppingCart className="mr-2 text-[#d9e85e]" />
                          <span className="text-sm text-gray-300">
                            Quantity:
                          </span>{" "}
                          {quantity}
                        </span>
                        <span className="flex items-center">
                          <FaBox className="mr-2 text-[#d9e85e]" />
                          <span className="text-sm text-gray-300">
                            In Stock:
                          </span>{" "}
                          {countInStock}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/product/${_id}`}
                      className="inline-block mt-4 bg-[#d9e85e] text-[#8b5e34] font-bold py-2 px-4 rounded hover:bg-opacity-90 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              )
            )}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;
