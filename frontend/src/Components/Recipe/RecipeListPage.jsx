import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaClock,
  FaUtensils,
  FaStar,
  FaRegStar,
  FaCrown,
  FaInfoCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecipes,
  setRecipes,
  setLoading,
  setError,
} from "../../slices/recipeSlice";
import Navbar from "../Navbar";
import bgImage from "../../Images/RecipeBg.png";

const RecipeListPage = () => {
  const dispatch = useDispatch();
  const { recipes, isLoading, error } = useSelector((state) => state.recipes);

  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 3;

  // Filter states
  const [filterCuisine, setFilterCuisine] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);
  const [filterDietary, setFilterDietary] = useState([]);
  const [filterCookingTime, setFilterCookingTime] = useState([]);
  const [filterRating, setFilterRating] = useState([]);
  const [filterPremium, setFilterPremium] = useState("All");
  const [sortOption, setSortOption] = useState("Newest First");

  // Available filter options
  const cuisineOptions = [
    "Nepali",
    "Indian",
    "Chinese",
    "Italian",
    "Mexican",
    "American",
    "Thai",
  ];
  const categoryOptions = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snack",
    "Appetizer",
    "Soup",
    "Salad",
  ];
  const dietaryOptions = [
    "Vegetarian",
    "Non-Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
  ];
  const cookingTimeOptions = ["Under 30 mins", "30-60 mins", "Over 60 mins"];
  const ratingOptions = ["5★", "4★+", "3★+", "2★+", "1★+"];
  const premiumOptions = ["All", "Premium Only", "Basic Only"];
  const sortOptions = [
    "Newest First",
    "Oldest First",
    "Highest Rated",
    "Most Popular",
  ];

  const isPremiumUser =
    useSelector((state) => state.auth.user?.isPremium) || false;

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/400x300?text=No+Image+Available";
  };

  // Apply filters when any filter condition changes
  useEffect(() => {
    let filtered = [...recipes];

    // Apply premium filter first
    if (filterPremium === "Premium Only") {
      filtered = filtered.filter((recipe) => recipe.isPremium);
    } else if (filterPremium === "Basic Only") {
      filtered = filtered.filter((recipe) => !recipe.isPremium);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title &&
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply cuisine filter
    if (filterCuisine.length > 0) {
      filtered = filtered.filter((recipe) =>
        filterCuisine.includes(recipe.cuisine)
      );
    }

    // Apply category filter
    if (filterCategory.length > 0) {
      filtered = filtered.filter((recipe) =>
        filterCategory.includes(recipe.category)
      );
    }

    // Apply dietary filter
    if (filterDietary.length > 0) {
      filtered = filtered.filter((recipe) => {
        return filterDietary.some((diet) => {
          if (diet === "Vegetarian") return recipe.isVegetarian;
          if (diet === "Non-Vegetarian") return !recipe.isVegetarian;
          if (diet === "Vegan") return recipe.isVegan;
          if (diet === "Gluten-Free") return recipe.isGlutenFree;
          if (diet === "Dairy-Free") return recipe.isDairyFree;
          return false;
        });
      });
    }

    // Apply cooking time filter
    if (filterCookingTime.length > 0) {
      filtered = filtered.filter((recipe) => {
        const prepTimeMinutes = parseInt(recipe.prepTime);
        return filterCookingTime.some((timeRange) => {
          if (timeRange === "Under 30 mins") return prepTimeMinutes < 30;
          if (timeRange === "30-60 mins")
            return prepTimeMinutes >= 30 && prepTimeMinutes <= 60;
          if (timeRange === "Over 60 mins") return prepTimeMinutes > 60;
          return false;
        });
      });
    }

    // Apply rating filter
    if (filterRating.length > 0) {
      filtered = filtered.filter((recipe) => {
        const recipeRating = recipe.rating || 0;
        return filterRating.some((ratingOption) => {
          const minRating = parseInt(ratingOption.charAt(0));
          return recipeRating >= minRating;
        });
      });
    }

    // Apply sorting
    if (sortOption === "Newest First") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "Oldest First") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === "Highest Rated") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === "Most Popular") {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    setFilteredRecipes(filtered);
    setCurrentPage(1);
  }, [
    searchQuery,
    recipes,
    filterCuisine,
    filterCategory,
    filterDietary,
    filterCookingTime,
    filterRating,
    filterPremium,
    sortOption,
    isPremiumUser,
  ]);

  // Helper function to render star ratings
  const renderStarRating = (rating, numRatings) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <FaRegStar className="text-yellow-400" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <FaStar className="text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-400" />
        ))}
        <span className="ml-1 text-gray-400 text-sm">({numRatings || 0})</span>
      </div>
    );
  };

  // Handle premium filter change
  const handlePremiumChange = (premiumType) => {
    setFilterPremium(premiumType);
  };

  // Handle cuisine filter change
  const handleCuisineChange = (cuisine) => {
    if (filterCuisine.includes(cuisine)) {
      setFilterCuisine(filterCuisine.filter((item) => item !== cuisine));
    } else {
      setFilterCuisine([...filterCuisine, cuisine]);
    }
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    if (filterCategory.includes(category)) {
      setFilterCategory(filterCategory.filter((item) => item !== category));
    } else {
      setFilterCategory([...filterCategory, category]);
    }
  };

  // Handle dietary filter change
  const handleDietaryChange = (diet) => {
    if (filterDietary.includes(diet)) {
      setFilterDietary(filterDietary.filter((item) => item !== diet));
    } else {
      setFilterDietary([...filterDietary, diet]);
    }
  };

  // Handle cooking time filter change
  const handleCookingTimeChange = (time) => {
    if (filterCookingTime.includes(time)) {
      setFilterCookingTime(filterCookingTime.filter((item) => item !== time));
    } else {
      setFilterCookingTime([...filterCookingTime, time]);
    }
  };

  // Handle rating filter change
  const handleRatingChange = (rating) => {
    if (filterRating.includes(rating)) {
      setFilterRating(filterRating.filter((item) => item !== rating));
    } else {
      setFilterRating([...filterRating, rating]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterCuisine([]);
    setFilterCategory([]);
    setFilterDietary([]);
    setFilterCookingTime([]);
    setFilterRating([]);
    setFilterPremium("All");
    setSortOption("Newest First");
  };

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-700 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-xl text-gray-300">{error}</p>
          <button
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
            onClick={() => dispatch(fetchRecipes())} // Retry fetching
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Helper function to check if any filters are active
  const hasActiveFilters = () => {
    return (
      filterCuisine.length > 0 ||
      filterCategory.length > 0 ||
      filterDietary.length > 0 ||
      filterCookingTime.length > 0 ||
      filterRating.length > 0 ||
      filterPremium !== "All" ||
      sortOption !== "Newest First" ||
      searchQuery !== ""
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Hero Section with Glassmorphism */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          height: "500px",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl font-bold mb-6 text-white text-center">
            Discover <span className="text-indigo-400">Delicious</span> Recipes
          </h1>

          {/* Search Bar with Glassmorphism */}
          <div className="relative w-full max-w-md">
            <div className="backdrop-blur-md bg-black/30 rounded-full border border-gray-600 flex items-center p-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for recipes..."
                className="w-full py-3 px-5 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
              <button className="p-3 text-gray-300 hover:text-white transition-colors">
                <FaSearch size={20} />
              </button>
              <div className="h-6 w-px bg-gray-600 mx-1"></div>
              <button
                className={`p-3 ${
                  hasActiveFilters() ? "text-indigo-400" : "text-gray-300"
                } hover:text-white transition-colors`}
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <FaFilter size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel with Animation */}
      <div
        className={`bg-gray-800 transition-all duration-300 overflow-hidden ${
          showFilters ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="container mx-auto py-6 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3 text-indigo-300">
                Cuisine
              </h2>
              <div className="space-y-2">
                {cuisineOptions.map((cuisine) => (
                  <div key={cuisine} className="flex items-center">
                    <input
                      type="checkbox"
                      id={cuisine}
                      checked={filterCuisine.includes(cuisine)}
                      onChange={() => handleCuisineChange(cuisine)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={cuisine}
                      className="ml-2 text-gray-300 cursor-pointer hover:text-white"
                    >
                      {cuisine}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3 text-indigo-300">
                Category
              </h2>
              <div className="space-y-2">
                {categoryOptions.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={category}
                      checked={filterCategory.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={category}
                      className="ml-2 text-gray-300 cursor-pointer hover:text-white"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3 text-indigo-300">
                Dietary
              </h2>
              <div className="space-y-2">
                {dietaryOptions.map((diet) => (
                  <div key={diet} className="flex items-center">
                    <input
                      type="checkbox"
                      id={diet}
                      checked={filterDietary.includes(diet)}
                      onChange={() => handleDietaryChange(diet)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={diet}
                      className="ml-2 text-gray-300 cursor-pointer hover:text-white"
                    >
                      {diet}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3 text-indigo-300">
                Cooking Time
              </h2>
              <div className="space-y-2">
                {cookingTimeOptions.map((time) => (
                  <div key={time} className="flex items-center">
                    <input
                      type="checkbox"
                      id={time}
                      checked={filterCookingTime.includes(time)}
                      onChange={() => handleCookingTimeChange(time)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={time}
                      className="ml-2 text-gray-300 cursor-pointer hover:text-white"
                    >
                      {time}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3 text-indigo-300">
                Rating
              </h2>
              <div className="space-y-2">
                {ratingOptions.map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="checkbox"
                      id={rating}
                      checked={filterRating.includes(rating)}
                      onChange={() => handleRatingChange(rating)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={rating}
                      className="ml-2 text-gray-300 cursor-pointer hover:text-white flex items-center"
                    >
                      {rating}{" "}
                      <FaStar className="ml-1 text-yellow-400" size={12} />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3 text-indigo-300">
                Recipe Type
              </h2>
              <div className="space-y-2">
                {premiumOptions.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="radio"
                      id={`premium-${option}`}
                      name="premiumFilter"
                      checked={filterPremium === option}
                      onChange={() => handlePremiumChange(option)}
                      className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`premium-${option}`}
                      className="ml-2 text-gray-300 cursor-pointer hover:text-white flex items-center"
                    >
                      {option}
                      {option === "Premium Only" && (
                        <FaCrown className="ml-1 text-yellow-400" size={12} />
                      )}
                      {option === "Premium Only" && (
                        <span className="text-xs text-gray-400 ml-1">
                          (visible to all)
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3 text-indigo-300">
                Sort By
              </h2>
              <div className="space-y-2">
                {sortOptions.map((sort) => (
                  <div key={sort} className="flex items-center">
                    <input
                      type="radio"
                      id={sort}
                      name="sort"
                      checked={sortOption === sort}
                      onChange={() => setSortOption(sort)}
                      className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={sort}
                      className="ml-2 text-gray-300 cursor-pointer hover:text-white"
                    >
                      {sort}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 mr-2"
              onClick={resetFilters}
            >
              Reset
            </button>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="container mx-auto px-4 pt-6">
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-400">Active Filters:</span>

              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200">
                  Search: {searchQuery}
                  <button
                    className="ml-2 text-indigo-200 hover:text-white"
                    onClick={() => setSearchQuery("")}
                  >
                    &times;
                  </button>
                </span>
              )}

              {filterCuisine.map((cuisine) => (
                <span
                  key={cuisine}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200"
                >
                  {cuisine}
                  <button
                    className="ml-2 text-indigo-200 hover:text-white"
                    onClick={() => handleCuisineChange(cuisine)}
                  >
                    &times;
                  </button>
                </span>
              ))}

              {filterCategory.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200"
                >
                  {category}
                  <button
                    className="ml-2 text-indigo-200 hover:text-white"
                    onClick={() => handleCategoryChange(category)}
                  >
                    &times;
                  </button>
                </span>
              ))}

              {filterDietary.map((diet) => (
                <span
                  key={diet}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200"
                >
                  {diet}
                  <button
                    className="ml-2 text-indigo-200 hover:text-white"
                    onClick={() => handleDietaryChange(diet)}
                  >
                    &times;
                  </button>
                </span>
              ))}

              {filterCookingTime.map((time) => (
                <span
                  key={time}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200"
                >
                  {time}
                  <button
                    className="ml-2 text-indigo-200 hover:text-white"
                    onClick={() => handleCookingTimeChange(time)}
                  >
                    &times;
                  </button>
                </span>
              ))}

              {filterRating.map((rating) => (
                <span
                  key={rating}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200"
                >
                  {rating}
                  <button
                    className="ml-2 text-indigo-200 hover:text-white"
                    onClick={() => handleRatingChange(rating)}
                  >
                    &times;
                  </button>
                </span>
              ))}

              {filterPremium !== "All" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200">
                  {filterPremium}
                  <button
                    className="ml-2 text-indigo-200 hover:text-white"
                    onClick={() => setFilterPremium("All")}
                  >
                    &times;
                  </button>
                </span>
              )}

              {sortOption !== "Newest First" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200">
                  Sort: {sortOption}
                </span>
              )}

              <button
                className="ml-auto text-indigo-400 hover:text-indigo-300 text-sm underline"
                onClick={resetFilters}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Cards */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            <span className="inline-block border-b-2 border-indigo-500 pb-1">
              {hasActiveFilters() ? "Filtered Recipes" : "Featured Recipes"}
            </span>
            {hasActiveFilters() && (
              <span className="ml-4 text-gray-400 text-lg">
                {filteredRecipes.length}{" "}
                {filteredRecipes.length === 1 ? "recipe" : "recipes"} found
              </span>
            )}
          </h2>
          <Link
            to="/addrecipes"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300"
          >
            <FaPlus /> Add Recipe
          </Link>
        </div>

        {/* Recipe Cards grid */}
        <div className="grid grid-cols-1 gap-8">
          {currentRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-[1.01] hover:shadow-indigo-500/25"
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={
                      recipe.image ||
                      "https://via.placeholder.com/400x300?text=No+Image+Available"
                    }
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  {recipe.isPremium && (
                    <div className="absolute top-2 left-2 bg-yellow-600 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center">
                      <FaCrown className="mr-1" /> PREMIUM
                    </div>
                  )}
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {recipe.title}
                    </h3>
                    {!isPremiumUser && recipe.isPremium && (
                      <span className="text-xs bg-yellow-900 text-yellow-200 px-2 py-1 rounded">
                        Upgrade to view
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {recipe.cuisine && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200">
                        {recipe.cuisine}
                      </span>
                    )}
                    {recipe.category && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900 text-purple-200">
                        {recipe.category}
                      </span>
                    )}
                    <span className="inline-flex items-center text-gray-400">
                      <FaClock className="mr-1" /> {recipe.prepTime} min
                    </span>
                    <span className="inline-flex items-center text-gray-400">
                      <FaUtensils className="mr-1" /> Serves: {recipe.servings}
                    </span>
                    {recipe.isVegetarian && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200">
                        Vegetarian
                      </span>
                    )}
                    {recipe.isVegan && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200">
                        Vegan
                      </span>
                    )}
                    {recipe.isGlutenFree && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
                        Gluten-Free
                      </span>
                    )}
                    {recipe.isDairyFree && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
                        Dairy-Free
                      </span>
                    )}
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {recipe.description}
                  </p>

                  {recipe.isPremium && !isPremiumUser && (
                    <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-200 text-sm flex items-start">
                      <FaInfoCircle className="flex-shrink-0 mt-0.5 mr-2" />
                      <span>
                        This is a premium recipe. Upgrade your account to view
                        the full details, ingredients, and instructions.
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {renderStarRating(recipe.rating, recipe.numRatings)}
                      {recipe.isPremium && (
                        <span className="ml-2 text-yellow-400 flex items-center">
                          <FaCrown className="mr-1" /> Premium
                        </span>
                      )}
                    </div>
                    {recipe.isPremium && !isPremiumUser ? (
                      <Link
                        to="/premium-subscription"
                        className="px-5 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition duration-300 flex items-center"
                      >
                        <FaCrown className="mr-2" /> Upgrade to View
                      </Link>
                    ) : (
                      <Link
                        to={`/recipes/${recipe._id}`}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                      >
                        View Recipe
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {/* Empty State */}
        {filteredRecipes.length === 0 && !isLoading && !error && (
          <div className="text-center py-16 bg-gray-800 rounded-xl my-10 border border-gray-700">
            <div className="bg-gray-700 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
              <FaUtensils className="text-4xl text-gray-400" />
            </div>
            {hasActiveFilters() ? (
              <>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No matching recipes found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your filters to find more recipes
                </p>
                <button
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                  onClick={resetFilters}
                >
                  Clear Filters
                </button>
              </>
            ) : filterPremium === "Premium Only" ? (
              <>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {isPremiumUser
                    ? "No Premium Recipes Available"
                    : "Premium Recipes Available"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {isPremiumUser
                    ? "There are currently no premium recipes in our collection."
                    : "Upgrade to premium to access exclusive recipes"}
                </p>
                {!isPremiumUser && (
                  <Link
                    to="/subscription"
                    className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition duration-300"
                  >
                    Upgrade Now
                  </Link>
                )}
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No recipes found
                </h3>
                <p className="text-gray-400 mb-6">
                  Be the first to add a recipe to our collection!
                </p>
                <Link
                  to="/addrecipes"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300"
                >
                  Add Your First Recipe
                </Link>
              </>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredRecipes.length > recipesPerPage && (
          <div className="flex justify-center mt-10">
            <div className="inline-flex bg-gray-800 rounded-lg shadow-md">
              <button
                className={`px-4 py-2 rounded-l-lg transition duration-300 ${
                  currentPage === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <div className="px-4 py-2 bg-gray-700 text-white font-medium">
                {currentPage} of {totalPages}
              </div>

              <button
                className={`px-4 py-2 rounded-r-lg transition duration-300 ${
                  currentPage === totalPages
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-10 mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Foodie Hub</h2>
              <p className="text-gray-400 mb-4">
                Discover, create, and share amazing recipes from around the
                world.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Newsletter</h2>
              <p className="text-gray-400 mb-4">
                Subscribe to get the latest recipes and updates.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full rounded-l-lg bg-gray-700 text-white border-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 Foodie Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RecipeListPage;
