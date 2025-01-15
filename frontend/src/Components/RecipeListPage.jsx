import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { setRecipes } from "../slices/recipeSlice"; // Import the setRecipes action
import Navbar from "./Navbar";
import bgImage from "../Images/RecipeBg.png";

const RecipeListPage = () => {
  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes.recipes); // Get recipes from Redux store
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 3;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/recipes");
        dispatch(setRecipes(response.data.recipes)); // Dispatch action to set recipes
        setFilteredRecipes(response.data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [dispatch]);

  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/400x300?text=No+Image+Available";
  };

  useEffect(() => {
    const filtered = recipes.filter(
      (recipe) =>
        recipe.title &&
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecipes(filtered);
    setCurrentPage(1); // Reset to the first page when a search is done
  }, [searchQuery, recipes]);

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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p className="text-xl">Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat flex flex-col items-end text-white"
        style={{
          width: "100%",
          height: "650px",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Search Section */}
        <div className="text-center mt-44 mr-24">
          <h1 className="text-4xl font-bold mb-4">Search for Recipes</h1>
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Recipes"
              className="py-2 px-4 rounded-lg w-80 text-black"
            />
            <button
              className="absolute right-12 flex items-center text-gray-600 hover:text-gray-900"
              title="Search"
            >
              <FaSearch size={20} />
            </button>
            <span className="absolute right-9 text-gray-500 font-bold">|</span>
            <button
              className="absolute right-2 flex items-center text-gray-600 hover:text-gray-900"
              onClick={() => setShowFilters((prev) => !prev)}
              title="Filter"
            >
              <FaFilter size={20} />
            </button>
          </div>
        </div>

        {/* Filter Section (Dynamic Visibility) */}
        {showFilters && (
          <div className="bg-black bg-opacity-50 py-4 px-8 rounded-lg w-full max-w-4xl mx-auto mt-8">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">Cuisine</h2>
                <ul className="space-y-1">
                  <li className="cursor-pointer text-gray-300">Nepali</li>
                  <li className="cursor-pointer text-gray-300">Indian</li>
                  <li className="cursor-pointer text-gray-300">Chinese</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
                <ul className="space-y-1">
                  <li className="cursor-pointer text-gray-300">Veg</li>
                  <li className="cursor-pointer text-gray-300">Non-Veg</li>
                  <li className="cursor-pointer text-gray-300">Vegan</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Rating</h2>
                <ul className="space-y-1">
                  <li className="cursor-pointer text-gray-300">High to Low</li>
                  <li className="cursor-pointer text-gray-300">Low to High</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Type</h2>
                <ul className="space-y-1">
                  <li className="cursor-pointer text-gray-300">Free</li>
                  <li className="cursor-pointer text-gray-300">Premium</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Recipe Button */}
      <div className="flex justify-end max-w-6xl mx-auto p-6">
        <Link
          to="/addrecipes"
          className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
        >
          Add Recipe
        </Link>
      </div>
      {/* Featured Recipes */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl mb-8 text-center underline">
          Featured Recipes
        </h2>
        <div className="space-y-6">
          {currentRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-lg shadow-md flex overflow-hidden"
            >
              <img
                src={
                  recipe.image ||
                  "https://via.placeholder.com/400x300?text=No+Image+Available"
                }
                alt={recipe.title}
                className="w-1/3 object-cover h-auto"
                onError={handleImageError}
              />
              <div className="p-4 flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {recipe.description}
                </p>
                <div className="mt-4 flex justify-between">
                  <span className="text-sm text-gray-500">
                    {recipe.prepTime}
                  </span>
                  <span className="text-sm text-gray-500">
                    {recipe.category}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500">
                    Serves: {recipe.servings}
                  </span>
                  <Link
                    to={`/recipes/${recipe._id}`}
                    className="ml-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && !loading && !error && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No recipes found</p>
            <Link
              to="/addrecipes"
              className="mt-4 inline-block py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Your First Recipe
            </Link>
          </div>
        )}

        {/* Pagination */}
        {filteredRecipes.length > recipesPerPage && (
          <div className="flex justify-center mt-6">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="mx-4 text-lg">{currentPage}</span>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-6xl mx-auto flex justify-between">
          <div>
            <h2 className="text-lg font-bold">Home</h2>
            <ul>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold">Social</h2>
            <ul>
              <li>Facebook</li>
              <li>Twitter</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold">Newsletter</h2>
            <p className="text-sm">Subscribe to our newsletter</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RecipeListPage;
