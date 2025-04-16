import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../../redux/features/shop/shopSlice";
import Loader from "../../Components/Loader";
import ProductCard from "../Products/ProductCart";
import { FaFilter, FaTimes, FaSearch } from "react-icons/fa";
import Navbar from "../Navbar";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading) {
      // Filter products based on checked categories, price range, and search term
      const filteredProducts = filteredProductsQuery.data?.filter((product) => {
        // Name search filter
        const nameMatches = product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        // Price range filter
        let priceMatches = true;
        if (selectedPriceRange) {
          const [min, max] = selectedPriceRange.split("-").map(Number);
          if (max) {
            priceMatches = product.price >= min && product.price <= max;
          } else {
            // For "X+" ranges (e.g., "1000+")
            priceMatches = product.price >= min;
          }
        }

        return nameMatches && priceMatches;
      });

      dispatch(setProducts(filteredProducts));
    }
  }, [
    checked,
    radio,
    filteredProductsQuery.data,
    dispatch,
    searchTerm,
    selectedPriceRange,
  ]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(range);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedPriceRange("");
    dispatch(setChecked([]));
    window.location.reload();
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Define price ranges for the filter
  const priceRanges = [
    { label: "Under Rs50", value: "0-50" },
    { label: "Rs50 - Rs100", value: "50-100" },
    { label: "Rs100 - Rs200", value: "100-200" },
    { label: "Rs200 - Rs500", value: "200-500" },
    { label: "Rs500 - Rs1000", value: "500-1000" },
    { label: "Rs1000+", value: "1000-" },
  ];

  return (
    <div>
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">Shop Products</h1>
            <button
              onClick={toggleMobileSidebar}
              className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg flex items-center"
            >
              <FaFilter className="mr-2" /> Filters
            </button>
          </div>

          {/* Product Search Bar - Visible on both mobile and desktop */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters */}
            <div
              className={`
                lg:w-1/4 bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300
                ${
                  mobileSidebarOpen
                    ? "fixed inset-0 z-50 lg:relative lg:inset-auto"
                    : "hidden lg:block"
                }
              `}
            >
              {/* Mobile Close Button */}
              <div className="lg:hidden flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Filters</h2>
                <button
                  onClick={toggleMobileSidebar}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="p-5">
                {/* Categories Filter */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-white bg-gray-900 rounded-lg p-3 mb-4 flex items-center">
                    <span className="w-2 h-6 bg-pink-600 rounded-full mr-2"></span>
                    Categories
                  </h2>
                  <div className="space-y-3 pl-2">
                    {categoriesQuery.isLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader />
                      </div>
                    ) : (
                      categories?.map((c) => (
                        <div key={c._id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${c._id}`}
                            onChange={(e) =>
                              handleCheck(e.target.checked, c._id)
                            }
                            checked={checked.includes(c._id)}
                            className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
                          />
                          <label
                            htmlFor={`category-${c._id}`}
                            className="ml-3 text-sm font-medium text-gray-300 hover:text-white cursor-pointer"
                          >
                            {c.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Brands Filter */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-white bg-gray-900 rounded-lg p-3 mb-4 flex items-center">
                    <span className="w-2 h-6 bg-pink-600 rounded-full mr-2"></span>
                    Brands
                  </h2>
                  <div className="space-y-3 pl-2">
                    {filteredProductsQuery.isLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader />
                      </div>
                    ) : (
                      uniqueBrands?.map((brand) => (
                        <div key={brand} className="flex items-center">
                          <input
                            type="radio"
                            id={`brand-${brand}`}
                            name="brand"
                            onChange={() => handleBrandClick(brand)}
                            className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 focus:ring-pink-500 focus:ring-2"
                          />
                          <label
                            htmlFor={`brand-${brand}`}
                            className="ml-3 text-sm font-medium text-gray-300 hover:text-white cursor-pointer"
                          >
                            {brand}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-white bg-gray-900 rounded-lg p-3 mb-4 flex items-center">
                    <span className="w-2 h-6 bg-pink-600 rounded-full mr-2"></span>
                    Price Range
                  </h2>
                  <div className="space-y-3 pl-2">
                    {priceRanges.map((range) => (
                      <div key={range.value} className="flex items-center">
                        <input
                          type="radio"
                          id={`price-${range.value}`}
                          name="priceRange"
                          value={range.value}
                          checked={selectedPriceRange === range.value}
                          onChange={() => handlePriceRangeChange(range.value)}
                          className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 focus:ring-pink-500 focus:ring-2"
                        />
                        <label
                          htmlFor={`price-${range.value}`}
                          className="ml-3 text-sm font-medium text-gray-300 hover:text-white cursor-pointer"
                        >
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 border border-gray-600"
                >
                  Reset All Filters
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-xl font-bold text-white">
                    <span className="text-pink-500">{products?.length}</span>{" "}
                    Products Found
                  </h1>

                  <div className="text-sm text-gray-400">
                    {searchTerm && (
                      <span className="mr-2">Search: "{searchTerm}"</span>
                    )}
                    {checked.length > 0 && (
                      <span className="mr-2">
                        | {checked.length}{" "}
                        {checked.length === 1 ? "category" : "categories"}
                      </span>
                    )}
                    {radio.length > 0 && (
                      <span className="mr-2">| brand filtered</span>
                    )}
                    {selectedPriceRange && <span>| price filtered</span>}
                  </div>
                </div>

                {filteredProductsQuery.isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader />
                  </div>
                ) : products?.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">
                      No products match your filters
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-4 bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products?.map((p) => (
                      <div
                        key={p._id}
                        className="transform transition duration-300 hover:scale-105"
                      >
                        <ProductCard p={p} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
