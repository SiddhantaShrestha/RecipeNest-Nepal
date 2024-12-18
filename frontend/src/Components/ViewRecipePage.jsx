import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewRecipePage = () => {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/recipes/${id}`)
      .then((response) => setRecipe(response.data.recipe))
      .catch((error) => console.error("Error fetching recipe:", error));
  }, [id]);

  if (!recipe) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/recipes")}
        className="mb-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Back to Recipes
      </button>

      {/* Recipe Content */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Recipe Image */}
        <img
          src={recipe.image || "https://via.placeholder.com/500x300"}
          alt={recipe.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          {/* Recipe Title */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {recipe.title}
          </h1>

          {/* Recipe Description */}
          <p className="text-lg text-gray-700 mb-4">{recipe.description}</p>

          {/* Preparation Time and Servings */}
          <div className="mb-6">
            <p className="text-lg font-medium text-gray-700">
              <strong>Preparation Time:</strong> {recipe.prepTime} minutes
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>Servings:</strong> {recipe.servings}
            </p>
          </div>

          {/* Ingredients Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Ingredients
            </h2>
            <ul className="list-disc pl-5 mb-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-600">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Steps</h2>
            <ol className="list-decimal pl-5">
              {recipe.steps.map((step, index) => (
                <li key={index} className="mb-4">
                  <p className="text-gray-600">{step.description}</p>
                  {step.image && (
                    <img
                      src={step.image}
                      alt={`Step ${index + 1}`}
                      className="mt-2 w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Category */}
          <p className="mt-4 text-lg text-gray-500">
            <strong>Category:</strong> {recipe.category}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewRecipePage;
