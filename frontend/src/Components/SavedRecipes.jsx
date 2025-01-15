import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { setRecipes } from "../slices/recipeSlice";
import { restoreAuth } from "../slices/authSlice";
import Navbar from "./Navbar";

const SavedRecipes = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const { recipes, loading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    // Check if token is populated and user is authenticated
    console.log("Token in Redux store:", token);
    console.log("User authenticated:", isAuthenticated);

    if (isAuthenticated && token) {
      const fetchBookmarkedRecipes = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/register/bookmarks",
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

  // Loading and error handling
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Saved Recipes</h2>
        {recipes.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">No saved recipes yet</p>
            <Link
              to="/recipes"
              className="text-green-500 hover:text-green-600 underline"
            >
              Browse recipes to save
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Link
                to={`/recipes/${recipe._id}`}
                key={recipe._id}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={recipe.image || "https://via.placeholder.com/300x200"}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200";
                  }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {recipe.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;
