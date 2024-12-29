import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/recipes");
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Fallback image in case of loading error
  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/400x300?text=No+Image+Available";
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
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Our Recipes</h1>
          <Link
            to="/addrecipes"
            className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add New Recipe
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <img
                  src={
                    recipe.image ||
                    "https://via.placeholder.com/400x300?text=No+Image+Available"
                  }
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                  {recipe.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {recipe.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {recipe.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {recipe.prepTime}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Serves: {recipe.servings}
                  </span>
                  <Link
                    to={`/recipes/${recipe._id}`}
                    className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recipes.length === 0 && !loading && !error && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No recipes found</p>
            <Link
              to="/recipes/add"
              className="mt-4 inline-block py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Your First Recipe
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeListPage;
