import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { setRecipes } from "../slices/recipeSlice";
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
            dispatch(setRecipes(response.data.bookmarkedRecipes));
          } else {
            throw new Error(
              response.data.message || "Failed to fetch saved recipes."
            );
          }
        } catch (error) {
          console.error("Error fetching bookmarked recipes:", error);
          dispatch(setRecipes([]));
        }
      };

      fetchBookmarkedRecipes();
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

  // Handle the removal of a saved recipe
  const handleRemoveBookmark = async (recipeId) => {
    if (window.confirm("Remove this recipe from your saved collection?")) {
      try {
        await axios.delete(
          `http://localhost:8000/api/users/bookmarks/${recipeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(
          setRecipes(recipes.filter((recipe) => recipe._id !== recipeId))
        );
        alert("Recipe removed from saved collection");
      } catch (err) {
        console.error("Failed to remove saved recipe:", err);
        alert(err.response?.data?.message || "Failed to remove recipe");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <SubNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl mb-8 text-center font-bold text-emerald-400 border-b border-gray-700 pb-4">
          Saved Recipes
        </h2>

        <div className="flex justify-between items-center mb-6">
          <Link
            to="/recipes"
            className="flex items-center text-gray-400 hover:text-emerald-400 transition duration-200"
          >
            <FaArrowLeft className="mr-2" /> Browse All Recipes
          </Link>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search saved recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-4 pl-10 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-200 p-4 rounded-lg text-center my-8">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-md"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && recipes.length === 0 && (
          <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
            <svg
              className="mx-auto h-16 w-16 text-gray-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              ></path>
            </svg>
            <p className="text-xl text-gray-300 mb-4">
              You haven't saved any recipes yet.
            </p>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Find delicious recipes and save them for easy access when you're
              ready to cook.
            </p>
            <Link
              to="/recipes"
              className="py-3 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-200 inline-flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              Browse Recipes
            </Link>
          </div>
        )}

        {/* No Search Results */}
        {!loading &&
          !error &&
          recipes.length > 0 &&
          filteredRecipes.length === 0 && (
            <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
              <svg
                className="mx-auto h-12 w-12 text-gray-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <p className="text-xl text-gray-300 mb-2">
                No matching recipes found
              </p>
              <p className="text-gray-400 mb-4">Try a different search term</p>
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition duration-200"
              >
                Clear Search
              </button>
            </div>
          )}

        {/* Recipe List */}
        {!loading && !error && filteredRecipes.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-emerald-500/50 transition-all duration-200 flex flex-col md:flex-row"
              >
                <div
                  className="w-full md:w-1/3 h-48 md:h-auto bg-gray-700 cursor-pointer overflow-hidden"
                  onClick={() =>
                    (window.location.href = `/recipes/${recipe._id}`)
                  }
                >
                  <img
                    src={
                      recipe.image ||
                      "https://via.placeholder.com/400x300?text=No+Image+Available"
                    }
                    alt={recipe.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Image+Available")
                    }
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div
                    onClick={() =>
                      (window.location.href = `/recipes/${recipe._id}`)
                    }
                    className="cursor-pointer"
                  >
                    <h3 className="text-xl font-bold text-white mb-2 hover:text-emerald-400 transition">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-400 mt-2 line-clamp-3">
                      {recipe.description && recipe.description.length > 150
                        ? `${recipe.description.substring(0, 150)}...`
                        : recipe.description || "No description available"}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {recipe.category && (
                      <span className="text-xs px-2 py-1 bg-emerald-900/50 text-emerald-300 rounded-full">
                        {recipe.category}
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full flex items-center">
                      <FaClock className="w-3 h-3 mr-1" />
                      {recipe.prepTime || "30 mins"}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full flex items-center">
                      <FaUtensils className="w-3 h-3 mr-1" />
                      Serves {recipe.servings || "4"}
                    </span>
                  </div>

                  <div className="mt-auto pt-4 flex justify-end space-x-2">
                    <button
                      onClick={() =>
                        (window.location.href = `/recipes/${recipe._id}`)
                      }
                      className="py-1.5 px-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                      View
                    </button>
                    <button
                      onClick={() => handleRemoveBookmark(recipe._id)}
                      className="py-1.5 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {recipes.length > 3 && filteredRecipes.length > 0 && (
          <div className="mt-6 text-center text-gray-400">
            <p>
              Showing {filteredRecipes.length} of {recipes.length} saved recipes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;
