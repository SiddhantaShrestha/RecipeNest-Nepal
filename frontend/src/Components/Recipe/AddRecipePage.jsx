import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addRecipe } from "../../slices/recipeSlice";
import axios from "axios";
import Navbar from "../Navbar";
import SubNavbar from "../SubNavbar";

const AddRecipePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "" }]);
  const [steps, setSteps] = useState([
    { description: "", image: null, imagePreview: "" },
  ]);
  const [category, setCategory] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [prepTimeHours, setPrepTimeHours] = useState(0);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(0);
  const [servings, setServings] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Handle changes to the hours input field
  const handlePrepTimeHoursChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPrepTimeHours(value);
      updatePrepTime(value, prepTimeMinutes);
    }
  };

  // Handle changes to the minutes input field
  const handlePrepTimeMinutesChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPrepTimeMinutes(value);
      updatePrepTime(prepTimeHours, value);
    }
  };

  // Update the final prepTime string based on hours and minutes
  const updatePrepTime = (hours, minutes) => {
    let timeString = "";
    if (hours && Number(hours) > 0) {
      timeString += `${hours} hr `;
    }
    if (minutes && Number(minutes) > 0) {
      timeString += `${minutes} min`;
    }
    setPrepTime(timeString.trim());
  };

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].name = value;
    setIngredients(updatedIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "" }]);
  };

  const removeIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

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
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append(
        "ingredients",
        JSON.stringify(ingredients.map((ing) => ing.name))
      );
      formData.append("category", category);
      formData.append("prepTime", prepTime);
      formData.append("servings", servings);
      formData.append("isPremium", isPremium);

      if (mainImage) {
        formData.append("mainImage", mainImage);
      }

      const stepsData = steps.map((step) => ({
        description: step.description,
        image: "",
      }));
      formData.append("steps", JSON.stringify(stepsData));

      steps.forEach((step, index) => {
        if (step.image) {
          formData.append("stepImages", step.image);
        }
      });

      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        "http://localhost:8000/recipes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(addRecipe(response.data));
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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setShowLoginModal(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <SubNavbar />
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 shadow-lg rounded-lg mt-10 border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-emerald-400">
          Create New Recipe
        </h1>
        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-lg p-4 text-center text-red-200 mb-6">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className="text-lg font-semibold mb-2 text-emerald-300"
            >
              Recipe Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
              placeholder="Enter recipe title"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-lg font-semibold mb-2 text-emerald-300"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
              placeholder="Briefly describe your recipe"
            />
          </div>

          {/* Main Recipe Image */}
          <div className="flex flex-col">
            <label
              htmlFor="mainImage"
              className="text-lg font-semibold mb-2 text-emerald-300"
            >
              Main Recipe Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-all overflow-hidden">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 h-full w-full">
                  {!mainImagePreview ? (
                    <>
                      <svg
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        SVG, PNG, JPG or GIF
                      </p>
                    </>
                  ) : (
                    <div className="h-full w-full">
                      <img
                        src={mainImagePreview}
                        alt="Recipe preview"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="mainImage"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div className="flex flex-col">
              <label
                htmlFor="category"
                className="text-lg font-semibold mb-2 text-emerald-300"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                placeholder="e.g., Dessert, Main Course"
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="isPremium"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="isPremium"
                className="ml-2 text-lg text-emerald-300"
              >
                Premium Recipe (Only visible to premium users)
              </label>
            </div>

            {/* Preparation Time */}
            <div className="flex flex-col">
              <label
                htmlFor="prepTime"
                className="text-lg font-semibold mb-2 text-emerald-300"
              >
                Preparation Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg p-1">
                  <input
                    type="number"
                    value={prepTimeHours}
                    onChange={handlePrepTimeHoursChange}
                    className="w-full p-2 bg-transparent focus:outline-none text-white"
                    placeholder="0"
                    min="0"
                    max="99"
                  />
                  <span className="pr-2 text-gray-400">hr</span>
                </div>
                <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg p-1">
                  <input
                    type="number"
                    value={prepTimeMinutes}
                    onChange={handlePrepTimeMinutesChange}
                    className="w-full p-2 bg-transparent focus:outline-none text-white"
                    placeholder="0"
                    min="0"
                    max="59"
                  />
                  <span className="pr-2 text-gray-400">min</span>
                </div>
              </div>
              {prepTime && (
                <div className="mt-2 text-sm text-emerald-400">
                  Total prep time: {prepTime}
                </div>
              )}
            </div>

            {/* Servings */}
            <div className="flex flex-col">
              <label
                htmlFor="servings"
                className="text-lg font-semibold mb-2 text-emerald-300"
              >
                Servings
              </label>
              <input
                type="number"
                id="servings"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                required
                min="1"
                className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                placeholder="e.g., 4"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <label className="text-lg font-semibold mb-4 text-emerald-300 block">
              Ingredients
            </label>
            <div className="space-y-3 mb-4">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) =>
                      handleIngredientChange(index, e.target.value)
                    }
                    placeholder="Enter ingredient with quantity (e.g., 2 cups flour)"
                    required
                    className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="ml-2 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
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
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="w-full p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center"
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
              Add Ingredient
            </button>
          </div>

          {/* Steps */}
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <label className="text-lg font-semibold mb-4 text-emerald-300 block">
              Recipe Steps
            </label>
            <div className="space-y-6 mb-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-600"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg text-emerald-400">
                      Step {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
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
                    </button>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium mb-2 text-emerald-300">
                      Description
                    </label>
                    <textarea
                      value={step.description}
                      onChange={(e) =>
                        handleStepChange(index, "description", e.target.value)
                      }
                      required
                      rows="3"
                      placeholder="Describe what to do in this step"
                      className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white mb-4"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium mb-2 text-emerald-300">
                      Step Image (Optional)
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-all overflow-hidden">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 h-full w-full">
                          {!step.imagePreview ? (
                            <>
                              <svg
                                className="w-8 h-8 mb-3 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                              </svg>
                              <p className="text-xs text-gray-400">
                                Upload an image for this step (optional)
                              </p>
                            </>
                          ) : (
                            <div className="h-full w-full">
                              <img
                                src={step.imagePreview}
                                alt={`Step ${index + 1} preview`}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleStepImageChange(index, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addStep}
              className="w-full p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center"
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
              Add Step
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-lg font-bold ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg transform hover:scale-105"
            } text-white transition-all duration-300 flex items-center justify-center`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                Creating Recipe...
              </>
            ) : (
              <>
                <svg
                  className="w-6 h-6 mr-2"
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
                Create Recipe
              </>
            )}
          </button>
        </form>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-emerald-400">
              Authentication Required
            </h2>
            <p className="mb-6 text-gray-300">
              You need to be logged in to create a recipe.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRecipePage;
