import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setError } from "../../slices/recipeSlice";
import Navbar from "../Navbar";
import SubNavbar from "../SubNavbar";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("authToken");

  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [],
    steps: [],
    category: "",
    prepTime: "",
    servings: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [stepImages, setStepImages] = useState([]);
  const [stepImagePreviews, setStepImagePreviews] = useState([]);
  const [error, setErrorState] = useState("");
  const [prepTimeHours, setPrepTimeHours] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/recipes/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecipe(response.data.recipe);
        setImagePreview(response.data.recipe.image);
        setStepImagePreviews(
          response.data.recipe.steps.map((step) => step.image || "")
        );

        // Set the initial prepTime from the recipe (split it into hours and minutes)
        const [hours, minutes] = response.data.recipe.prepTime
          .split(" hr ")
          .map((time) => time.replace(" min", ""));
        setPrepTimeHours(hours || "");
        setPrepTimeMinutes(minutes || "");
      } catch (err) {
        console.error("Error fetching recipe:", err);
        dispatch(setError("Failed to load recipe"));
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRecipe();
    } else {
      navigate("/login");
    }
  }, [id, token, navigate, dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStepImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const newStepImages = [...stepImages];
    newStepImages[index] = file;
    setStepImages(newStepImages);

    const newStepImagePreviews = [...stepImagePreviews];
    const reader = new FileReader();
    reader.onloadend = () => {
      newStepImagePreviews[index] = reader.result;
      setStepImagePreviews(newStepImagePreviews);
    };
    reader.readAsDataURL(file);
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...recipe.steps];
    updatedSteps[index][field] = value;
    setRecipe({ ...recipe, steps: updatedSteps });
  };

  const addStep = () => {
    setRecipe({
      ...recipe,
      steps: [...recipe.steps, { description: "", image: null }],
    });
    setStepImages([...stepImages, null]);
    setStepImagePreviews([...stepImagePreviews, ""]);
  };

  const removeStep = (index) => {
    const updatedSteps = recipe.steps.filter((_, i) => i !== index);
    setRecipe({ ...recipe, steps: updatedSteps });
    setStepImagePreviews(stepImagePreviews.filter((_, i) => i !== index));
    setStepImages(stepImages.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, ""],
    });
  };

  const removeIngredient = (index) => {
    const updatedIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const handlePrepTimeHoursChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPrepTimeHours(value);
      updatePrepTime(value, prepTimeMinutes);
    }
  };

  const handlePrepTimeMinutesChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPrepTimeMinutes(value);
      updatePrepTime(prepTimeHours, value);
    }
  };

  const updatePrepTime = (hours, minutes) => {
    let timeString = "";
    if (hours && Number(hours) > 0) {
      timeString += `${hours} hr `;
    }
    if (minutes && Number(minutes) > 0) {
      timeString += `${minutes} min`;
    }
    setRecipe((prevRecipe) => ({ ...prevRecipe, prepTime: timeString.trim() }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", recipe.title);
    formData.append("description", recipe.description);
    formData.append("ingredients", JSON.stringify(recipe.ingredients));
    formData.append("steps", JSON.stringify(recipe.steps));
    formData.append("category", recipe.category);
    formData.append("prepTime", recipe.prepTime);
    formData.append("servings", recipe.servings);

    if (image) {
      formData.append("mainImage", image);
    }

    stepImages.forEach((stepImage, index) => {
      if (stepImage) {
        formData.append("stepImages", stepImage);
      }
    });

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:8000/recipes/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);
      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error("Error updating recipe:", err);
      setErrorState(err.response?.data?.message || "Failed to update recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <SubNavbar />
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 shadow-lg rounded-lg mt-10 border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-emerald-400">
          Edit Recipe
        </h1>

        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-lg p-4 text-center text-red-200 mb-6">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
            <span className="ml-3 text-emerald-400">Loading recipe...</span>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-6">
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
                value={recipe.title}
                onChange={(e) =>
                  setRecipe({ ...recipe, title: e.target.value })
                }
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
                value={recipe.description}
                onChange={(e) =>
                  setRecipe({ ...recipe, description: e.target.value })
                }
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
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
                    {!imagePreview ? (
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
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={imagePreview}
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
                    onChange={handleImageChange}
                    className="hidden"
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
                  value={recipe.category}
                  onChange={(e) =>
                    setRecipe({ ...recipe, category: e.target.value })
                  }
                  required
                  className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                  placeholder="e.g., Dessert, Main Course"
                />
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
                {recipe.prepTime && (
                  <div className="mt-2 text-sm text-emerald-400">
                    Total prep time: {recipe.prepTime}
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
                  value={recipe.servings}
                  onChange={(e) =>
                    setRecipe({ ...recipe, servings: e.target.value })
                  }
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
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) =>
                        setRecipe({
                          ...recipe,
                          ingredients: recipe.ingredients.map((item, i) =>
                            i === index ? e.target.value : item
                          ),
                        })
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
                {recipe.steps.map((step, index) => (
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
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
                            {!stepImagePreviews[index] ? (
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
                              <div className="w-full h-full flex items-center justify-center">
                                <img
                                  src={stepImagePreviews[index]}
                                  alt={`Step ${index + 1} preview`}
                                  className="h-full w-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleStepImageChange(e, index)}
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
                  Updating Recipe...
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    ></path>
                  </svg>
                  Update Recipe
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditRecipe;
