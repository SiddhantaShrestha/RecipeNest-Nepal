import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRecipePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState([
    { description: "", image: null, imagePreview: "" },
  ]);
  const [category, setCategory] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [servings, setServings] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStepImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedSteps = [...steps];
      updatedSteps[index].image = file;

      const reader = new FileReader();
      reader.onloadend = () => {
        updatedSteps[index].imagePreview = reader.result;
        setSteps(updatedSteps);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("ingredients", JSON.stringify(ingredients.split(",")));
      formData.append("category", category);
      formData.append("prepTime", prepTime);
      formData.append("servings", servings);

      // Append main image
      if (mainImage) {
        formData.append("mainImage", mainImage);
      }

      // Format steps and append step images
      const stepsData = steps.map((step) => ({
        description: step.description,
        image: "", // This will be updated by the backend
      }));
      formData.append("steps", JSON.stringify(stepsData));

      // Append step images separately
      steps.forEach((step, index) => {
        if (step.image) {
          formData.append("stepImages", step.image);
        }
      });

      const response = await axios.post(
        "http://localhost:8000/recipes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/recipes");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding recipe");
    } finally {
      setLoading(false);
    }
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = value;
    setSteps(updatedSteps);
  };

  const addStep = () => {
    setSteps([...steps, { description: "", image: null, imagePreview: "" }]);
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
            placeholder="Enter recipe title"
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
            placeholder="Enter recipe description"
          />
        </div>

        {/* Preparation Time */}
        <div className="flex flex-col">
          <label htmlFor="prepTime" className="text-lg font-semibold">
            Preparation Time
          </label>
          <input
            type="text"
            id="prepTime"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            required
            className="mt-2 p-2 border rounded-lg"
            placeholder="e.g., 30 minutes"
          />
        </div>

        {/* Servings */}
        <div className="flex flex-col">
          <label htmlFor="servings" className="text-lg font-semibold">
            Servings
          </label>
          <input
            type="number"
            id="servings"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            required
            className="mt-2 p-2 border rounded-lg"
            placeholder="e.g., 4"
          />
        </div>

        {/* Ingredients */}
        <div className="flex flex-col">
          <label htmlFor="ingredients" className="text-lg font-semibold">
            Ingredients
          </label>
          <input
            type="text"
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            className="mt-2 p-2 border rounded-lg"
            placeholder="Enter ingredients separated by commas"
          />
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
            placeholder="e.g., Dessert, Main Course, etc."
          />
        </div>

        {/* Main Recipe Image */}
        <div className="flex flex-col">
          <label htmlFor="mainImage" className="text-lg font-semibold">
            Main Recipe Image
          </label>
          <input
            type="file"
            id="mainImage"
            accept="image/*"
            onChange={handleMainImageChange}
            required
            className="mt-2 p-2 border rounded-lg"
          />
          {mainImagePreview && (
            <div className="mt-2">
              <img
                src={mainImagePreview}
                alt="Recipe preview"
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Steps */}
        <div>
          <label className="text-lg font-semibold">Recipe Steps</label>
          {steps.map((step, index) => (
            <div key={index} className="mt-4 p-4 border rounded-lg">
              <div className="flex flex-col">
                <label className="font-medium">
                  Step {index + 1} Description
                </label>
                <textarea
                  value={step.description}
                  onChange={(e) =>
                    handleStepChange(index, "description", e.target.value)
                  }
                  required
                  rows="2"
                  placeholder="Enter step description"
                  className="p-2 mt-2 border rounded-lg"
                />
              </div>
              <div className="flex flex-col mt-2">
                <label className="font-medium">
                  Step {index + 1} Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleStepImageChange(index, e)}
                  className="p-2 mt-2 border rounded-lg"
                />
                {step.imagePreview && (
                  <div className="mt-2">
                    <img
                      src={step.imagePreview}
                      alt={`Step ${index + 1} preview`}
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="mt-4 text-red-500 hover:underline"
                >
                  Remove Step
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Another Step
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-2 ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded-lg`}
        >
          {loading ? "Adding Recipe..." : "Add Recipe"}
        </button>
      </form>
    </div>
  );
};

export default AddRecipePage;
