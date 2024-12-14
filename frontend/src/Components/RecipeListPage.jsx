import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/recipes")
      .then((response) => setRecipes(response.data.recipes))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-8">Our Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={recipe.image || "https://via.placeholder.com/150"}
              alt={recipe.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {recipe.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{recipe.description}</p>
              <p className="text-sm text-gray-500">{recipe.category}</p>
              <Link
                to={`/recipes/${recipe._id}`}
                className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 block text-center"
              >
                View Recipe
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeListPage;
