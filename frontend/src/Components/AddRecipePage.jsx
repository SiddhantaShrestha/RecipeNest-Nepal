import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRecipePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState([{ description: "", image: "" }]);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [prepTime, setPrepTime] = useState(""); // Renamed to match backend
  const [servings, setServings] = useState(""); // This remains unchanged
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/recipes", {
        title,
        description,
        ingredients: ingredients.split(","), // Splitting ingredients into an array
        steps,
        category,
        image,
        prepTime, // Changed to match backend
        servings,
      });
      navigate("/recipes"); // Redirect to recipes page after success
    } catch (err) {
      setError("Error adding recipe");
    }
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = value;
    setSteps(updatedSteps);
  };

  const addStep = () => {
    setSteps([...steps, { description: "", image: "" }]);
  };

  const removeStep = (index) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    setSteps(updatedSteps);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Add a New Recipe</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-lg font-semibold">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-2 p-2 border rounded-lg"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label htmlFor="description" className="text-lg font-semibold">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            className="mt-2 p-2 border rounded-lg"
          />
        </div>

        {/* Preparation Time */}
        <div className="flex flex-col">
          <label htmlFor="prepTime" className="text-lg font-semibold">
            Preparation Time (e.g., 30 minutes)
          </label>
          <input
            type="text"
            id="prepTime"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            required
            className="mt-2 p-2 border rounded-lg"
          />
        </div>

        {/* Servings */}
        <div className="flex flex-col">
          <label htmlFor="servings" className="text-lg font-semibold">
            Servings (e.g., 4 people)
          </label>
          <input
            type="text"
            id="servings"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            required
            className="mt-2 p-2 border rounded-lg"
          />
        </div>

        {/* Ingredients */}
        <div className="flex flex-col">
          <label htmlFor="ingredients" className="text-lg font-semibold">
            Ingredients (comma separated)
          </label>
          <input
            type="text"
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            className="mt-2 p-2 border rounded-lg"
          />
        </div>

        {/* Steps */}
        <div>
          <label className="text-lg font-semibold">Steps</label>
          {steps.map((step, index) => (
            <div key={index} className="mt-4 p-4 border rounded-lg">
              <div className="flex flex-col">
                <label className="font-medium">
                  Step {index + 1} Description
                </label>
                <input
                  type="text"
                  value={step.description}
                  onChange={(e) =>
                    handleStepChange(index, "description", e.target.value)
                  }
                  placeholder="Enter step description"
                  className="p-2 mt-2 border rounded-lg"
                />
              </div>
              <div className="flex flex-col mt-2">
                <label className="font-medium">
                  Step {index + 1} Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={step.image}
                  onChange={(e) =>
                    handleStepChange(index, "image", e.target.value)
                  }
                  placeholder="Enter image URL"
                  className="p-2 mt-2 border rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="mt-4 text-red-500 hover:underline"
              >
                Remove Step
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Step
          </button>
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label htmlFor="category" className="text-lg font-semibold">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="mt-2 p-2 border rounded-lg"
          />
        </div>

        {/* Recipe Image */}
        <div className="flex flex-col">
          <label htmlFor="image" className="text-lg font-semibold">
            Main Recipe Image URL
          </label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mt-2 p-2 border rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipePage;
