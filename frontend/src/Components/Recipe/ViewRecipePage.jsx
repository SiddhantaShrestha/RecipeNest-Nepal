import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { setCurrentRecipe, setBookmarkStatus } from "../../slices/recipeSlice";
import {
  FaClock,
  FaUsers,
  FaBookmark,
  FaStar,
  FaArrowLeft,
  FaUtensils,
  FaLock,
  FaRegStar,
  FaShoppingCart,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useGetFilteredProductsQuery } from "../../redux/api/productApiSlice";
import api from "../../api";

const ViewRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isPremiumRecipe, setIsPremiumRecipe] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [hasRated, setHasRated] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [ingredientProducts, setIngredientProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const { token, user, isAuthenticated } = useSelector((state) => state.auth);
  const { isPremium: isUserPremium } = useSelector(
    (state) => state.auth.user || {}
  );

  const recipe = useSelector((state) => state.recipes.currentRecipe);
  const isBookmarked = useSelector((state) => state.recipes.isBookmarked);

  // Fetch ingredient-related products based on recipe ingredients
  const fetchIngredientProducts = async (ingredients) => {
    if (!ingredients?.length) return;

    // Improved extraction
    const extractMain = (text) => {
      const withoutQty = text.replace(/^[\d./]+\s*\w*\s*/, ""); // Remove "200g", "1/2 cup", etc.
      const main = withoutQty.split(/[, ]+/)[0].replace(/,/g, "").toLowerCase();
      return main;
    };

    const blockedWords = new Set(["taste", "and", "or", "peeled", "smashed"]);

    const ingredientKeywords = ingredients
      .map(extractMain)
      .filter((word) => word.length > 2 && !blockedWords.has(word));

    // API call
    try {
      const response = await axios.post("/api/products/filtered-products", {
        keywords: [...new Set(ingredientKeywords)].slice(0, 5), // Dedupe + limit
      });
      setIngredientProducts(response.data.products?.slice(0, 6) || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Fetch recipe and bookmark status
  useEffect(() => {
    setLoading(true);
    setAccessDenied(false);

    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/recipes/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const recipeData = response.data.recipe;
        setIsPremiumRecipe(recipeData.isPremium);

        // Check if recipe is premium and user is not premium
        if (recipeData.isPremium && !isUserPremium) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        dispatch(setCurrentRecipe(recipeData));
        setRatings(recipeData.ratings || []);

        // Fetch ingredient products once we have the recipe data
        if (recipeData.ingredients && recipeData.ingredients.length > 0) {
          fetchIngredientProducts(recipeData.ingredients);
        }

        // Check if user has already rated this recipe
        if (token && recipeData.ratings) {
          const userHasRated = recipeData.ratings.some(
            (rating) => rating.user._id === user?._id
          );
          setHasRated(userHasRated);
        }

        // Fetch related recipes after getting the current recipe
        fetchRelatedRecipes(recipeData.category);

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
          const response = await api.get("/users/bookmarks", {
            headers: { Authorization: `Bearer ${token}` },
          });
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
  }, [id, token, dispatch, isUserPremium, accessDenied, user?._id]);

  // Fetch related recipes based on the category
  const fetchRelatedRecipes = async (category) => {
    try {
      const response = await api.get(`/recipes?category=${category}&limit=3`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // Filter out the current recipe
      const filteredRecipes = response.data.recipes.filter(
        (recipe) => recipe._id !== id
      );

      // If we don't have enough recipes after filtering, fetch more
      if (filteredRecipes.length < 3) {
        const additionalResponse = await api.get(`/recipes?limit=5`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        // Combine and filter unique recipes
        const additionalRecipes = additionalResponse.data.recipes.filter(
          (recipe) =>
            recipe._id !== id &&
            !filteredRecipes.some((r) => r._id === recipe._id)
        );

        // Take what we need to get to 3 total
        const neededCount = 3 - filteredRecipes.length;
        const recipesToAdd = additionalRecipes.slice(0, neededCount);

        setRelatedRecipes([...filteredRecipes, ...recipesToAdd]);
      } else {
        // If we have enough (3 or more), just take the first 3
        setRelatedRecipes(filteredRecipes.slice(0, 3));
      }
    } catch (error) {
      console.error("Related recipes fetch error:", error);
    }
  };

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(
      (item) => item.product._id === product._id
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { product, quantity: 1 }]);
    }

    // SweetAlert2 notification
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Added ${product.name} to cart!`,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      background: "#1F2937", // gray-800
      color: "#E5E7EB", // gray-200
      iconColor: "#10B981", // green-500
    });
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();

    if (!userRating) {
      alert("Please select a rating before submitting.");
      return;
    }

    try {
      const response = await api.post(
        `/recipes/${id}/ratings`,
        {
          rating: userRating,
          comment: ratingComment || "Great recipe!",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the recipe state with the new rating
      const updatedRecipeResponse = await api.get(`/recipes/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      dispatch(setCurrentRecipe(updatedRecipeResponse.data.recipe));
      setRatings(updatedRecipeResponse.data.recipe.ratings);
      setHasRated(true);
      setUserRating(0);
      setRatingComment("");
      alert("Thank you for your rating!");
    } catch (error) {
      console.error("Rating submission error:", error);
      alert(error.response?.data?.message || "Failed to submit rating");
    }
  };

  const handleBookmarkToggle = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await api.post(
        "/users/toggle-bookmark",
        { recipeId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(setBookmarkStatus(response.data.isBookmarked));

      // SweetAlert2 notification
      Swal.fire({
        position: "top-end",
        icon: response.data.isBookmarked ? "success" : "info",
        title: response.data.isBookmarked
          ? "Recipe bookmarked!"
          : "Recipe removed from bookmarks",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: "#1F2937", // gray-800
        color: "#E5E7EB", // gray-200
        iconColor: response.data.isBookmarked ? "#10B981" : "#3B82F6", // green-500 for success, blue-500 for info
      });
    } catch (error) {
      console.error("Bookmark toggle error:", error);

      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "You need to log in again.",
          confirmButtonColor: "#6366F1", // indigo-500
          background: "#1F2937", // gray-800
          color: "#E5E7EB", // gray-200
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error bookmarking recipe. Please try again.",
          confirmButtonColor: "#6366F1", // indigo-500
          background: "#1F2937", // gray-800
          color: "#E5E7EB", // gray-200
        });
      }
    }
  };

  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/800x400?text=No+Image+Available";
  };

  const navigateToRecipe = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  const navigateToProduct = (productId) => {
    navigate(`/products/${productId}`);
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

          {/* Rating Summary */}
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <div className="text-3xl font-bold text-white mr-2">
                  {recipe.rating ? recipe.rating.toFixed(1) : "0.0"}
                </div>
                <div className="flex flex-col">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-xl ${
                          star <= Math.round(recipe.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {recipe.numRatings || 0} ratings
                  </span>
                </div>
              </div>
              {isAuthenticated && !hasRated && (
                <button
                  onClick={() => {
                    document.getElementById("ratings-section").scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Rate this recipe
                </button>
              )}
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
          {/* Left Column - Ingredients & Shop */}
          <div className="lg:col-span-1">
            {/* Ingredients List */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-indigo-300 flex items-center">
                <FaUtensils className="mr-2" /> Ingredients
              </h2>
              <ul className="space-y-4 mb-6">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-200 text-sm mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-300">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shop Ingredients Section */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-indigo-300 flex items-center">
                <FaShoppingCart className="mr-2" /> Shop Ingredients
              </h2>

              {ingredientProducts.length > 0 ? (
                <div className="space-y-5">
                  {ingredientProducts.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <img
                        src={product.image || "https://via.placeholder.com/100"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md mr-3"
                        onError={handleImageError}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">
                          {product.name}
                        </h3>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-indigo-300 font-bold">
                            ${product.price?.toFixed(2)}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigateToProduct(product._id)}
                              className="text-xs px-2 py-1 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 transition-colors"
                            >
                              <FaExternalLinkAlt />
                            </button>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="text-xs px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                    <button
                      onClick={() => navigate("/shop")}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 transition-colors text-white rounded-lg font-semibold"
                    >
                      Shop All Ingredients
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-700 rounded-lg">
                  <FaShoppingCart className="mx-auto text-4xl text-gray-500 mb-3" />
                  <p className="text-gray-400 mb-4">
                    No matching ingredients found
                  </p>
                  <button
                    onClick={() => navigate("/shop")}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Browse Shop
                  </button>
                </div>
              )}

              {/* Cart Summary */}
              {cartItems.length > 0 && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-white mb-3">
                    Cart (
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}{" "}
                    items)
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex justify-between"
                      >
                        <span className="text-gray-300">
                          {item.product.name} x {item.quantity}
                        </span>
                        <span className="text-indigo-300">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-gray-600 flex justify-between items-center">
                    <span className="font-semibold text-white">Total:</span>
                    <span className="text-lg font-bold text-indigo-300">
                      $
                      {cartItems
                        .reduce(
                          (total, item) =>
                            total + item.product.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/cart")}
                    className="w-full mt-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    View Cart
                  </button>
                </div>
              )}
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

            {/* Ratings Section */}
            <div
              id="ratings-section"
              className="mt-8 bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
            >
              <h2 className="text-2xl font-bold mb-6 text-indigo-300">
                Ratings & Reviews
              </h2>

              {/* Rating Form (only for authenticated users who haven't rated yet) */}
              {isAuthenticated && !hasRated && (
                <div className="mb-8 bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-white">
                    Rate this recipe
                  </h3>
                  <form onSubmit={handleRatingSubmit}>
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="text-3xl focus:outline-none mr-1"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setUserRating(star)}
                        >
                          {star <= (hoverRating || userRating) ? (
                            <FaStar className="text-yellow-400" />
                          ) : (
                            <FaRegStar className="text-gray-500" />
                          )}
                        </button>
                      ))}
                      <span className="ml-2 text-gray-300 mt-2">
                        {userRating > 0
                          ? `You selected ${userRating} star${
                              userRating > 1 ? "s" : ""
                            }`
                          : "Select rating"}
                      </span>
                    </div>
                    <textarea
                      placeholder="Share your experience with this recipe (optional)"
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                      rows="3"
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                    ></textarea>
                    <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                      disabled={!userRating}
                    >
                      Submit Rating
                    </button>
                  </form>
                </div>
              )}

              {/* Ratings List */}
              <div className="space-y-6">
                {ratings.length > 0 ? (
                  ratings.map((rating, index) => (
                    <div key={index} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="h-10 w-10 rounded-full bg-indigo-800 text-white flex items-center justify-center font-bold mr-3">
                          {rating.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {rating.name || "Anonymous"}
                          </p>
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={`${
                                    star <= rating.rating
                                      ? "text-yellow-400"
                                      : "text-gray-600"
                                  } text-sm`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-400">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      {rating.comment && (
                        <p className="text-gray-300 mt-2">{rating.comment}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <p className="text-gray-400">
                      No ratings yet. Be the first to rate this recipe!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Recipes - Dynamic Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-white">
            You Might Also Like
          </h2>
          {relatedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedRecipes.map((relatedRecipe) => (
                <div
                  key={relatedRecipe._id}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-[1.02] hover:shadow-indigo-500/25 border border-gray-700 cursor-pointer"
                  onClick={() => navigateToRecipe(relatedRecipe._id)}
                >
                  <img
                    src={
                      relatedRecipe.image ||
                      "https://via.placeholder.com/300x200?text=Recipe+Image"
                    }
                    alt={relatedRecipe.title}
                    className="w-full h-48 object-cover"
                    onError={handleImageError}
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white mb-2">
                      {relatedRecipe.title}
                    </h3>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-400 text-sm">
                        <FaClock className="mr-1" />{" "}
                        {relatedRecipe.prepTime || "25 mins"}
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`${
                              star <= Math.round(relatedRecipe.rating || 0)
                                ? "text-yellow-400"
                                : "text-gray-600"
                            } h-3 w-3`}
                          />
                        ))}
                      </div>
                    </div>
                    {relatedRecipe.isPremium && (
                      <span className="mt-2 inline-block px-2 py-1 text-xs font-semibold bg-yellow-600 text-white rounded-full">
                        PREMIUM
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <p className="text-gray-400">
                No related recipes found at the moment.
              </p>
            </div>
          )}
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
