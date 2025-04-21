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
import {
  FaFilter,
  FaTimes,
  FaSearch,
  FaTag,
  FaShoppingBag,
  FaDollarSign,
} from "react-icons/fa";

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

  // Count active filters
  const activeFiltersCount =
    (checked.length > 0 ? 1 : 0) +
    (radio.length > 0 ? 1 : 0) +
    (selectedPriceRange ? 1 : 0) +
    (searchTerm ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header with gradient */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-pink-800 opacity-80"></div>
          <div className="relative z-10 px-6 py-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Discover Our Collection
            </h1>
            <p className="text-gray-200 max-w-2xl">
              Find the perfect products tailored to your needs with our advanced
              filtering system.
            </p>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-400 mr-2">
              Filters:
            </span>
            {activeFiltersCount > 0 && (
              <span className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button
            onClick={toggleMobileSidebar}
            className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg flex items-center transition-all duration-300 border border-gray-700 shadow-lg"
          >
            <FaFilter className="mr-2" /> Filters
          </button>
        </div>

        {/* Product Search Bar - Visible on both mobile and desktop */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 shadow-lg"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div
            className={`
              lg:w-1/4 bg-gray-900 rounded-xl shadow-xl overflow-hidden transition-all duration-300 border border-gray-800
              ${
                mobileSidebarOpen
                  ? "fixed inset-0 z-50 lg:relative lg:inset-auto"
                  : "hidden lg:block"
              }
            `}
          >
            {/* Mobile Close Button */}
            <div className="lg:hidden flex justify-between items-center p-4 bg-gray-950 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Filters</h2>
              <button
                onClick={toggleMobileSidebar}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Categories Filter */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-white bg-gray-800 rounded-xl p-4 mb-4 flex items-center">
                  <FaTag className="mr-3 text-pink-500" />
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
                          onChange={(e) => handleCheck(e.target.checked, c._id)}
                          checked={checked.includes(c._id)}
                          className="w-5 h-5 text-pink-600 bg-gray-800 border-gray-700 rounded focus:ring-pink-500 focus:ring-2"
                        />
                        <label
                          htmlFor={`category-${c._id}`}
                          className="ml-3 text-sm font-medium text-gray-300 hover:text-white cursor-pointer transition-colors duration-200"
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
                <h2 className="text-lg font-semibold text-white bg-gray-800 rounded-xl p-4 mb-4 flex items-center">
                  <FaShoppingBag className="mr-3 text-pink-500" />
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
                          className="w-5 h-5 text-pink-600 bg-gray-800 border-gray-700 focus:ring-pink-500 focus:ring-2"
                        />
                        <label
                          htmlFor={`brand-${brand}`}
                          className="ml-3 text-sm font-medium text-gray-300 hover:text-white cursor-pointer transition-colors duration-200"
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
                <h2 className="text-lg font-semibold text-white bg-gray-800 rounded-xl p-4 mb-4 flex items-center">
                  <FaDollarSign className="mr-3 text-pink-500" />
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
                        className="w-5 h-5 text-pink-600 bg-gray-800 border-gray-700 focus:ring-pink-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`price-${range.value}`}
                        className="ml-3 text-sm font-medium text-gray-300 hover:text-white cursor-pointer transition-colors duration-200"
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
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-xl transition duration-300 border border-gray-700 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <FaTimes className="mr-2" /> Reset All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-white">
                    <span className="text-pink-500">{products?.length}</span>{" "}
                    Products Found
                  </h1>

                  {activeFiltersCount > 0 && (
                    <span className="ml-3 bg-gray-800 text-gray-300 text-xs font-medium px-3 py-1 rounded-full border border-gray-700">
                      {activeFiltersCount}{" "}
                      {activeFiltersCount === 1 ? "filter" : "filters"} applied
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-400 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
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
                <div className="text-center py-20 bg-gray-800 rounded-xl border border-gray-700">
                  <div className="mb-4 text-pink-500">
                    <FaSearch size={48} className="mx-auto opacity-50" />
                  </div>
                  <p className="text-gray-300 text-lg mb-2">
                    No products match your filters
                  </p>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your search criteria
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-8 rounded-xl transition duration-300 shadow-lg hover:shadow-xl"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products?.map((p) => (
                    <div
                      key={p._id}
                      className="transform transition duration-300 hover:scale-105 hover:shadow-2xl"
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
  );
};

export default Shop;
