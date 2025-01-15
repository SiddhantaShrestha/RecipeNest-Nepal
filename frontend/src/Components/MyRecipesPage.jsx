import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  setUserRecipes,
  setLoading,
  setError,
  deleteRecipe,
} from "../slices/recipeSlice";
import Navbar from "./Navbar";
import SubNavbar from "./SubNavbar";

const MyRecipesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userRecipes, isLoading, error } = useSelector(
    (state) => state.recipes
  );
  const token = localStorage.getItem("authToken");

  // Fetch user's recipes
  useEffect(() => {
    const fetchUserRecipes = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(
          "http://localhost:8000/recipes/my-recipes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(setUserRecipes(response.data.recipes));
        dispatch(setError(null)); // Clear any existing error after successful fetch
      } catch (err) {
        console.error("Error fetching recipes:", err);
        dispatch(
          setError(err.response?.data?.message || "Failed to fetch recipes")
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (token) {
      fetchUserRecipes();
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [dispatch, token, navigate]);

  // Handle recipe deletion
  const handleDelete = async (recipeId) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await axios.delete(`http://localhost:8000/recipes/${recipeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(deleteRecipe(recipeId)); // Update Redux state after deletion
        alert("Recipe deleted successfully");
      } catch (err) {
        console.error("Failed to delete recipe:", err);
        alert(err.response?.data?.message || "Failed to delete recipe");
      }
    }
  };

  // Navigate to recipe edit page
  const handleEdit = (recipeId) => {
    navigate(`/recipes/edit/${recipeId}`); // Navigate to the edit page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SubNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl mb-8 text-center underline">My Recipes</h2>
        <div className="space-y-6">
          {isLoading && (
            <p className="text-xl text-center">Loading your recipes...</p>
          )}
          {error && <p className="text-xl text-red-500 text-center">{error}</p>}
          {!isLoading && !error && userRecipes.length === 0 && (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">
                You have not created any recipes yet.
              </p>
              <button
                onClick={() => navigate("/addrecipes")}
                className="mt-4 inline-block py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Your First Recipe
              </button>
            </div>
          )}
          {!isLoading &&
            !error &&
            userRecipes.length > 0 &&
            userRecipes.map((recipe) => (
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
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/400x300?text=No+Image+Available")
                  }
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
                      {recipe.prepTime} minutes
                    </span>
                    <span className="text-sm text-gray-500">
                      Category: {recipe.category}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <span className="text-sm text-gray-500">
                      Serves: {recipe.servings}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(recipe._id)}
                        className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(recipe._id)}
                        className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination (if applicable) */}
      </div>
    </div>
  );
};

export default MyRecipesPage;
