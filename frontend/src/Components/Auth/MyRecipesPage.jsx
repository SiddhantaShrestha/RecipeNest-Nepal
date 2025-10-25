import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  setUserRecipes,
  setLoading,
  setError,
  deleteRecipe,
} from "../../slices/recipeSlice";
import Navbar from "../Navbar";
import SubNavbar from "../SubNavbar";
import api from "../../api";

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
        const response = await api.get("/recipes/my-recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setUserRecipes(response.data.recipes));
        dispatch(setError(null));
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
      navigate("/login");
    }
  }, [dispatch, token, navigate]);

  // Handle recipe deletion
  const handleDelete = async (recipeId) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await api.delete(`/recipes/${recipeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(deleteRecipe(recipeId));
        alert("Recipe deleted successfully");
      } catch (err) {
        console.error("Failed to delete recipe:", err);
        alert(err.response?.data?.message || "Failed to delete recipe");
      }
    }
  };

  // Navigate to recipe edit page
  const handleEdit = (recipeId) => {
    navigate(`/recipes/edit/${recipeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <SubNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl mb-8 text-center font-bold text-emerald-400 border-b border-gray-700 pb-4">
          My Recipes
        </h2>
        <div className="space-y-6">
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/40 border border-red-700 rounded-lg p-4 text-center text-red-200">
              <p className="text-lg">{error}</p>
            </div>
          )}

          {!isLoading && !error && userRecipes.length === 0 && (
            <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
              <svg
                className="w-16 h-16 mx-auto text-gray-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              <p className="text-xl text-gray-300 mb-4">
                You haven't created any recipes yet.
              </p>
              <button
                onClick={() => navigate("/addrecipes")}
                className="mt-4 inline-flex items-center py-3 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Your First Recipe
              </button>
            </div>
          )}

          {!isLoading && !error && userRecipes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-emerald-500/50"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={
                        recipe.image ||
                        "https://via.placeholder.com/600x400/1f2937/10b981?text=No+Image"
                      }
                      alt={recipe.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/600x400/1f2937/10b981?text=No+Image")
                      }
                    />
                    <div className="absolute top-0 right-0 bg-emerald-600 text-white px-3 py-1 rounded-bl-lg text-sm">
                      {recipe.category}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2 truncate">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {recipe.description}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-emerald-400">
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <span>{recipe.prepTime} </span>
                      </div>

                      <div className="flex items-center text-emerald-400">
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          ></path>
                        </svg>
                        <span>{recipe.servings}</span>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleEdit(recipe._id)}
                        className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          ></path>
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(recipe._id)}
                        className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRecipesPage;
