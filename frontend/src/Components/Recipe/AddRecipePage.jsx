import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addRecipe } from "../../slices/recipeSlice";
import axios from "axios";
import Navbar from "../Navbar";

const AddRecipePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Access auth state
  console.log(isAuthenticated);
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
  const [prepTimeHours, setPrepTimeHours] = useState(0); // State for hours
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(0); // State for minutes
  const [servings, setServings] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // State to control modal visibility

  // Handle changes to the hours dropdown
  // Handle changes to the hours input field
  const handlePrepTimeHoursChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // Only allow numbers
      setPrepTimeHours(value);
      updatePrepTime(value, prepTimeMinutes); // Update the final prep time string
    }
  };

  // Handle changes to the minutes input field
  const handlePrepTimeMinutesChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // Only allow numbers
      setPrepTimeMinutes(value);
      updatePrepTime(prepTimeHours, value); // Update the final prep time string
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
    setPrepTime(timeString.trim()); // Set the final prepTime string
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
      setShowLoginModal(true); // Show modal if not authenticated
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

      if (mainImage) {
        formData.append("mainImage", mainImage);
      }

      const stepsData = steps.map((step) => ({
        description: step.description,
        image: "", // This will be updated by the backend
      }));
      formData.append("steps", JSON.stringify(stepsData));

      steps.forEach((step, index) => {
        if (step.image) {
          formData.append("stepImages", step.image);
        }
      });

      const token = localStorage.getItem("authToken"); // Retrieve the token (ensure it matches your storage mechanism)

      const response = await axios.post(
        "http://localhost:8000/recipes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      dispatch(addRecipe(response.data)); // Dispatch the new recipe to Redux store
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
    console.log("Token in localStorage:", token ? "exists" : "missing");
  }, []);
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-center mb-6">
          Add a New Recipe
        </h1>
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

          {/* Preparation Time */}
          <div className="flex flex-col">
            <label htmlFor="prepTime" className="text-lg font-semibold">
              Preparation Time
            </label>
            <div className="flex items-center mt-2 space-x-4">
              <div>
                <input
                  type="number"
                  value={prepTimeHours}
                  onChange={handlePrepTimeHoursChange}
                  className="p-2 border rounded-lg"
                  placeholder="Hours"
                  maxLength="2" // Limit input length to 2 digits for hours
                />
                <span className="ml-2">hr</span>
              </div>

              <div>
                <input
                  type="number"
                  value={prepTimeMinutes}
                  onChange={handlePrepTimeMinutesChange}
                  className="p-2 border rounded-lg"
                  placeholder="Minutes"
                  maxLength="2" // Limit input length to 2 digits for minutes
                />
                <span className="ml-2">min</span>
              </div>
            </div>
            {/* Display the selected preparation time */}
            <input
              type="text"
              value={prepTime}
              readOnly
              className="mt-2 p-2 border rounded-lg"
              placeholder="e.g., 1 hr 30 min"
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
          <div>
            <label className="text-lg font-semibold">Ingredients</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center mt-2">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, e.target.value)
                  }
                  placeholder="Enter ingredient"
                  required
                  className="flex-1 p-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="ml-2 px-3 py-1 bg-red-500 text-white rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="mt-4 p-2 bg-green-600 text-white rounded-lg"
            >
              Add Ingredient
            </button>
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
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="mt-2 p-2 bg-red-500 text-white rounded-lg"
                >
                  Remove Step
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="mt-4 p-2 bg-green-600 text-white rounded-lg"
            >
              Add Step
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

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Please Log In</h2>
            <p className="mb-4">You need to be logged in to add a recipe.</p>
            <div className="flex justify-end">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Log In
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="ml-2 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRecipePage;
