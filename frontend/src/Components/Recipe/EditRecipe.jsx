import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setError } from "../../slices/recipeSlice";

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

  const [prepTimeHours, setPrepTimeHours] = useState(""); // New state for hours
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(""); // New state for minutes

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
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
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
      steps: [
        ...recipe.steps,
        { description: "", image: null, imagePreview: "" },
      ],
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

  // Update the prepTime state with the combined hours and minutes
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

    stepImages.forEach((stepImage) => {
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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-3xl text-center mb-6 underline">Edit Recipe</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Title */}
          <div className="flex flex-col">
            <label htmlFor="title" className="text-lg font-semibold">
              Recipe Title
            </label>
            <input
              type="text"
              id="title"
              value={recipe.title}
              onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
              className="mt-2 p-2 border rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label htmlFor="description" className="text-lg font-semibold">
              Description
            </label>
            <textarea
              id="description"
              value={recipe.description}
              onChange={(e) =>
                setRecipe({ ...recipe, description: e.target.value })
              }
              className="mt-2 p-2 border rounded-lg"
              required
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
              value={recipe.category}
              onChange={(e) =>
                setRecipe({ ...recipe, category: e.target.value })
              }
              className="mt-2 p-2 border rounded-lg"
              required
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
                  maxLength="2"
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
                  maxLength="2"
                />
                <span className="ml-2">min</span>
              </div>
            </div>

            {/* Display the selected preparation time */}
            <div className="mt-2 p-2 border rounded-lg">
              <span>
                {prepTimeHours > 0 && `${prepTimeHours} hr `}
                {prepTimeMinutes > 0 && `${prepTimeMinutes} min`}
                {prepTimeHours <= 0 &&
                  prepTimeMinutes <= 0 &&
                  "No prep time selected"}
              </span>
            </div>
          </div>

          {/* Servings */}
          <div className="flex flex-col">
            <label htmlFor="servings" className="text-lg font-semibold">
              Servings
            </label>
            <input
              type="number"
              id="servings"
              value={recipe.servings}
              onChange={(e) =>
                setRecipe({ ...recipe, servings: e.target.value })
              }
              className="mt-2 p-2 border rounded-lg"
              required
            />
          </div>

          {/* Ingredients */}
          <div>
            <label htmlFor="ingredients" className="text-lg font-semibold">
              Ingredients
            </label>
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center mt-2">
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
                  className="flex-1 p-2 border rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-2 bg-red-500 text-white rounded-lg"
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

          {/* Main Image */}
          <div className="flex flex-col">
            <label htmlFor="mainImage" className="text-lg font-semibold">
              Main Recipe Image
            </label>
            <input type="file" onChange={handleImageChange} className="mt-2" />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Recipe Image Preview"
                className="mt-2 w-40 h-40 object-cover"
              />
            )}
          </div>

          {/* Steps */}
          <div>
            <label htmlFor="steps" className="text-lg font-semibold">
              Recipe Steps
            </label>
            {recipe.steps.map((step, index) => (
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
                    className="p-2 mt-2 border rounded-lg"
                    placeholder="Step description"
                    required
                  />
                </div>
                <input
                  type="file"
                  onChange={(e) => handleStepImageChange(e, index)}
                  className="mt-2"
                />
                {stepImagePreviews[index] && (
                  <img
                    src={stepImagePreviews[index]}
                    alt="Step Image Preview"
                    className="mt-2 w-40 h-40 object-cover"
                  />
                )}
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

          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-lg"
          >
            Update Recipe
          </button>
        </form>
      )}
    </div>
  );
};

export default EditRecipe;
