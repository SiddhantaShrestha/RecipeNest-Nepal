import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../Navbar";
import { setCurrentRecipe, setBookmarkStatus } from "../../slices/recipeSlice";
import {
  FaClock,
  FaUsers,
  FaBookmark,
  FaPrint,
  FaShareAlt,
  FaStar,
  FaArrowLeft,
  FaUtensils,
  FaLock,
} from "react-icons/fa";

const ViewRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ text: "" });
  const [isPremiumRecipe, setIsPremiumRecipe] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const { token, user, isAuthenticated } = useSelector((state) => state.auth);
  const { isPremium: isUserPremium } = useSelector((state) => state.auth.user);

  const recipe = useSelector((state) => state.recipes.currentRecipe);
  const isBookmarked = useSelector((state) => state.recipes.isBookmarked);

  // Fetch recipe and bookmark status
  useEffect(() => {
    setLoading(true);
    setAccessDenied(false);

    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/recipes/${id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        const recipeData = response.data.recipe;
        setIsPremiumRecipe(recipeData.isPremium);

        // Check if recipe is premium and user is not premium
        if (recipeData.isPremium && !isUserPremium) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        dispatch(setCurrentRecipe(recipeData));
        setComments(recipeData.comments || []);
        setLoading(false);
      } catch (error) {
        console.error("Recipe fetch error:", error);
        if (error.response?.status === 403) {
          setAccessDenied(true);
        } else {
          setError("Failed to load recipe");
        }
        setLoading(false);
      }
    };

    const fetchBookmarks = async () => {
      if (token && !accessDenied) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/users/bookmarks",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const bookmarkedRecipes = response.data.bookmarkedRecipes;
          dispatch(
            setBookmarkStatus(
              bookmarkedRecipes.some((recipe) => recipe._id === id)
            )
          );
        } catch (error) {
          console.error("Bookmark fetch error:", error);
        }
      }
    };

    fetchRecipe();
    fetchBookmarks();
  }, [id, token, dispatch, isUserPremium, accessDenied]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Check if the text property exists and is not empty after trimming
    if (!newComment.text || !newComment.text.trim()) {
      alert("Please write a comment before submitting.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/recipes/${id}/comments`,
        { text: newComment.text }, // Send the text property, not the whole object
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new comment with the current user's information
      const newCommentWithUser = {
        ...response.data.comment,
        user: response.data.comment.user || user, // Fallback to current user if not populated
      };

      setComments([...comments, newCommentWithUser]);

      dispatch(
        setCurrentRecipe({
          ...recipe,
          comments: [...(recipe.comments || []), newCommentWithUser],
        })
      );
      setNewComment({ text: "" }); // Reset to empty object with text property
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post comment");
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/toggle-bookmark",
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

  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/800x400?text=No+Image+Available";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-700 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-md">
          <div className="flex justify-center mb-6">
            <FaLock className="text-5xl text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Premium Recipe</h2>
          <p className="text-gray-300 mb-6">
            This recipe is only available to premium members. Upgrade your
            account to access exclusive content.
          </p>
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/subscription")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 font-medium"
            >
              Upgrade to Premium
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() =>
                  navigate("/login", { state: { from: `/recipes/${id}` } })
                }
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 font-medium w-full"
              >
                Log In
              </button>
              <button
                onClick={() =>
                  navigate("/register", { state: { from: `/recipes/${id}` } })
                }
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300 font-medium w-full"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oops!</h2>
          <p className="text-xl text-gray-300">{error}</p>
          <button
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <Navbar />

      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white transition duration-300"
        >
          <FaArrowLeft className="mr-2" /> Back to Recipes
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Recipe Title and Actions */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              {recipe.title}
            </h1>
            {isPremiumRecipe && (
              <span className="ml-3 px-3 py-1 text-xs font-semibold bg-yellow-600 text-white rounded-full">
                PREMIUM
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex justify-center mb-4">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`${
                    star <= 4 ? "text-yellow-400" : "text-gray-600"
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-400">4.0 (24 reviews)</span>
            </div>
          </div>

          {/* Recipe Info */}
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="flex items-center text-gray-300">
              <FaClock className="mr-2 text-indigo-400" />
              <span>{recipe.prepTime || "30 mins"}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <FaUsers className="mr-2 text-indigo-400" />
              <span>Serves {recipe.servings || "4"}</span>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200">
              {recipe.category || "Main Course"}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handleBookmarkToggle}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition duration-300 ${
                isBookmarked
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-300 border border-gray-700 hover:border-indigo-500"
              }`}
            >
              <FaBookmark /> {isBookmarked ? "Bookmarked" : "Bookmark"}
            </button>
            <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:border-indigo-500 transition duration-300 flex items-center gap-2">
              <FaPrint /> Print
            </button>
            <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:border-indigo-500 transition duration-300 flex items-center gap-2">
              <FaShareAlt /> Share
            </button>
          </div>
        </div>

        {/* Main Recipe Image */}
        <div className="mb-10 overflow-hidden rounded-xl shadow-lg">
          <img
            src={recipe.image || "https://via.placeholder.com/800x400"}
            alt={recipe.title}
            className="w-full h-96 object-cover transform hover:scale-105 transition duration-500"
            onError={handleImageError}
          />
        </div>

        {/* Recipe Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ingredients */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-indigo-300 flex items-center">
                <FaUtensils className="mr-2" /> Ingredients
              </h2>
              <ul className="space-y-4">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-200 text-sm mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-300">{ingredient}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Nutrition Facts
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-400">Calories</p>
                    <p className="text-lg font-bold text-white">320</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-400">Protein</p>
                    <p className="text-lg font-bold text-white">12g</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-400">Carbs</p>
                    <p className="text-lg font-bold text-white">45g</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-400">Fat</p>
                    <p className="text-lg font-bold text-white">15g</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Steps */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-indigo-300">
                Cooking Instructions
              </h2>
              <div className="space-y-8">
                {recipe.steps?.map((step, index) => (
                  <div
                    key={index}
                    className="pb-8 border-b border-gray-700 last:border-0"
                  >
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg font-bold mr-3">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        Step {index + 1}
                      </h3>
                    </div>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    {step.image && (
                      <div className="mt-4 overflow-hidden rounded-lg shadow-md">
                        <img
                          src={step.image}
                          alt={`Step ${index + 1}`}
                          className="w-full object-cover h-64"
                          onError={handleImageError}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chef's Tips */}
              <div className="mt-8 p-6 bg-gray-700 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Chef's Tips
                </h3>
                <p className="text-gray-300 italic">
                  For best results, let your ingredients come to room
                  temperature before cooking. This dish pairs well with a side
                  of steamed vegetables or a fresh garden salad.
                </p>
              </div>
            </div>

            {/* User Comments Section */}
            <div className="mt-8 bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-indigo-300">
                Comments
              </h2>

              {/* Add Comment Form */}
              <div className="mb-6">
                <textarea
                  placeholder="Share your experience with this recipe..."
                  className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  value={newComment.text}
                  onChange={(e) => setNewComment({ text: e.target.value })}
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleCommentSubmit}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                  >
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Display Recipe Comments */}
              <div className="space-y-6">
                {recipe.comments && recipe.comments.length > 0 ? (
                  recipe.comments.map((comment, index) => (
                    <div key={index} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="h-10 w-10 rounded-full bg-indigo-800 text-white flex items-center justify-center font-bold mr-3">
                          {comment.user?.username?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {comment.user?.username || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-300">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <p className="text-gray-400">
                      No comments yet. Be the first to share your experience!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Recipes */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-white">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-[1.02] hover:shadow-indigo-500/25 border border-gray-700"
              >
                <img
                  src={`https://via.placeholder.com/300x200?text=Related+Recipe+${item}`}
                  alt={`Related Recipe ${item}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-white mb-2">
                    Related Recipe Title {item}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-400 text-sm">
                      <FaClock className="mr-1" /> 25 mins
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`${
                            star <= 4 ? "text-yellow-400" : "text-gray-600"
                          } h-3 w-3`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-10 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>© 2025 Foodie Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ViewRecipePage;
