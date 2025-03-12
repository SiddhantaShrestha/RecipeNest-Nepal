import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../Navbar";
import { setCurrentRecipe, setBookmarkStatus } from "../../slices/recipeSlice";

const ViewRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("authToken");
  const recipe = useSelector((state) => state.recipes.currentRecipe);
  const isBookmarked = useSelector((state) => state.recipes.isBookmarked);

  // Fetch recipe and bookmark status
  useEffect(() => {
    // Fetch recipe details
    axios
      .get(`http://localhost:8000/recipes/${id}`)
      .then((response) => {
        dispatch(setCurrentRecipe(response.data.recipe));
      })
      .catch((error) => {
        console.error("Recipe fetch error:", error);
      });

    // Fetch bookmarked recipes to check status
    if (token) {
      axios
        .get("http://localhost:8000/register/bookmarks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const bookmarkedRecipes = response.data.bookmarkedRecipes;
          dispatch(
            setBookmarkStatus(
              bookmarkedRecipes.some((recipe) => recipe._id === id)
            )
          );
        })
        .catch((error) => {
          console.error("Bookmark fetch error:", error);
          if (error.response?.status === 401) {
            navigate("/login");
          }
        });
    }
  }, [id, token, dispatch, navigate]);

  // Handle bookmark toggle
  const handleBookmarkToggle = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/register/toggle-bookmark",
        { recipeId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setBookmarkStatus(response.data.isBookmarked));
      alert(response.data.message);
    } catch (error) {
      console.error("Bookmark toggle error:", error);
      if (error.response?.status === 401) {
        alert("You need to log in again.");
        navigate("/login");
      } else {
        alert("Error bookmarking recipe. Please try again.");
      }
    }
  };

  if (!recipe) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="w-full sm:max-w-7xl mx-auto sm:px-12 px-6 py-8">
        {/* Recipe Title and Actions */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
          <div className="mt-4 flex justify-center space-x-4">
            <button className="px-4 py-2 bg-green-400 text-white rounded-lg">
              Premium
            </button>
            <button
              onClick={handleBookmarkToggle}
              className={`px-4 py-2 border rounded-lg flex items-center ${
                isBookmarked
                  ? "bg-green-400 text-white border-green-400"
                  : "border-green-400 text-green-400"
              }`}
            >
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </button>
          </div>
        </div>

        {/* Main Recipe Image */}
        <img
          src={recipe.image || "https://via.placeholder.com/800x400"}
          alt={recipe.title}
          className="w-full object-cover rounded-lg mb-8 max-h-96"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />

        {/* Recipe Details */}
        <div className="space-y-6">
          {/* Preparation Time */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Preparation Time</h2>
            <p className="text-gray-600">{recipe.prepTime}</p>
          </div>

          {/* Serving Size */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Serving Size</h2>
            <p className="text-gray-600">{recipe.servings}</p>
          </div>

          {/* Ingredients */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Ingredients Required</h2>
            <ul className="list-decimal pl-5 space-y-2">
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index} className="text-gray-600">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Steps</h2>
            <div className="space-y-6">
              {recipe.steps?.map((step, index) => (
                <div key={index}>
                  <p className="text-gray-600 mb-4">
                    <span className="font-semibold">Step {index + 1}:</span>{" "}
                    {step.description}
                  </p>
                  {step.image && (
                    <img
                      src={step.image}
                      alt={`Step ${index + 1}`}
                      className="w-full object-cover rounded-lg max-h-64 mb-4"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                        maxHeight: "300px",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRecipePage;
