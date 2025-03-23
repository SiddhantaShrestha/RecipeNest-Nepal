import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { setRecipes } from "../slices/recipeSlice";
import { restoreAuth } from "../slices/authSlice";
import Navbar from "./Navbar";
import {
  FaClock,
  FaUtensils,
  FaBookmark,
  FaSearch,
  FaArrowLeft,
} from "react-icons/fa";
import SubNavbar from "./SubNavbar";

const SavedRecipes = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const { recipes, loading, error } = useSelector((state) => state.recipes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    // Check if token is populated and user is authenticated
    console.log("Token in Redux store:", token);
    console.log("User authenticated:", isAuthenticated);

    if (isAuthenticated && token) {
      const fetchBookmarkedRecipes = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/users/bookmarks",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.success) {
            dispatch(setRecipes(response.data.bookmarkedRecipes)); // Save recipes to Redux state
          } else {
            throw new Error(
              response.data.message || "Failed to fetch saved recipes."
            );
          }
        } catch (error) {
          console.error("Error fetching bookmarked recipes:", error);
          dispatch(setRecipes([])); // Ensure recipes state is cleared if error occurs
        }
      };

      fetchBookmarkedRecipes();
    } else {
      console.log("User is not authenticated or token is missing.");
    }
  }, [dispatch, token, isAuthenticated]);

  // Filter recipes based on search term
  useEffect(() => {
    if (recipes) {
      setFilteredRecipes(
        recipes.filter((recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, recipes]);

  // Render loading state with animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400 mb-4"></div>
            <p className="text-gray-300 text-lg">
              Loading your saved recipes...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 text-center">
            <div className="text-red-400 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2 text-white">
              Something went wrong
            </h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Navbar />
      <SubNavbar />
      <div className="bg-gray-800 py-10 border-b border-gray-700 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white text-center">
              Your Saved Recipes
            </h1>
            <p className="text-gray-400 mb-6 text-center">
              All your favorite recipes in one place, ready to cook whenever you
              are.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search your saved recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 px-5 pl-12 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/recipes"
            className="inline-flex items-center text-gray-400 hover:text-indigo-400 transition duration-300"
          >
            <FaArrowLeft className="mr-2" /> Browse All Recipes
          </Link>
        </div>

        {recipes.length === 0 ? (
          <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 md:max-w-2xl p-8 text-center">
            <div className="text-7xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Your recipe collection is empty
            </h3>
            <p className="text-gray-400 mb-6">
              Start exploring delicious recipes and save your favorites for easy
              access later.
            </p>
            <Link
              to="/recipes"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Browse Recipes
            </Link>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              No matching recipes found
            </h3>
            <p className="text-gray-400 mb-4">
              Try a different search term or browse all your saved recipes.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <Link
                to={`/recipes/${recipe._id}`}
                key={recipe._id}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-indigo-900/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-700"
              >
                <div className="relative">
                  <img
                    src={
                      recipe.image ||
                      "https://via.placeholder.com/400x250?text=Recipe+Image"
                    }
                    alt={recipe.title}
                    className="w-full h-56 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x250?text=Recipe+Image";
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full flex items-center">
                      <FaBookmark className="mr-1" /> Saved
                    </span>
                  </div>
                  {recipe.category && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full">
                        {recipe.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="font-bold text-xl mb-2 text-white">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {recipe.description ||
                      "A delicious recipe saved to your collection."}
                  </p>

                  <div className="mt-auto flex justify-between items-center text-sm text-gray-400">
                    <div className="flex items-center">
                      <FaClock className="mr-1 text-indigo-400" />
                      <span>{recipe.prepTime || "30 mins"}</span>
                    </div>
                    <div className="flex items-center">
                      <FaUtensils className="mr-1 text-indigo-400" />
                      <span>Serves {recipe.servings || "4"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {recipes.length > 3 && (
        <div className="container mx-auto px-4 pb-12 text-center">
          <p className="text-gray-400 mb-4">
            Showing {filteredRecipes.length} of {recipes.length} saved recipes
          </p>
        </div>
      )}

      <footer className="bg-gray-800 border-t border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            Your personal recipe collection. Happy cooking!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SavedRecipes;
