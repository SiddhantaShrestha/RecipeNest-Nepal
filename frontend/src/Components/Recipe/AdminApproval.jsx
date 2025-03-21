import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTimes, FaInfoCircle } from "react-icons/fa";
import Navbar from "../Navbar";

const AdminRecipeApproval = () => {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [adminFeedback, setAdminFeedback] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "approve" or "reject"
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchPendingRecipes();
  }, []);

  const fetchPendingRecipes = async () => {
    try {
      setLoading(true);
      // Get token from wherever you're storing it
      const token = localStorage.getItem("token"); // or from your auth context

      const response = await axios.get(
        "http://localhost:8000/admin/recipes/pending",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // Adjust format based on your backend expectations
          },
        }
      );
      setPendingRecipes(response.data.recipes);
    } catch (error) {
      console.error("Error fetching pending recipes:", error);
      setError(
        error.response?.data?.message || "Failed to load pending recipes"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/400x300?text=No+Image+Available";
  };

  const openApproveModal = (recipe) => {
    setSelectedRecipe(recipe);
    setActionType("approve");
    setShowModal(true);
  };

  const openRejectModal = (recipe) => {
    setSelectedRecipe(recipe);
    setActionType("reject");
    setAdminFeedback("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
    setAdminFeedback("");
    setActionType("");
  };

  const handleSubmit = async () => {
    try {
      const status = actionType === "approve" ? "approved" : "rejected";

      await axios.put(
        `http://localhost:8000/admin/recipes/${selectedRecipe._id}/review`,
        {
          status,
          adminFeedback: status === "rejected" ? adminFeedback : "",
        },
        {
          withCredentials: true,
        }
      );

      // Update the local state to remove the processed recipe
      setPendingRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== selectedRecipe._id)
      );

      setSuccessMessage(
        `Recipe ${
          status === "approved" ? "approved" : "rejected"
        } successfully!`
      );

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      closeModal();
    } catch (error) {
      console.error("Error processing recipe:", error);
      setError(
        error.response?.data?.message ||
          `Failed to ${actionType} recipe. Please try again.`
      );
    }
  };

  const viewRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
    setActionType("view");
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <Navbar />
        <p className="text-xl mt-10">Loading pending recipes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Recipe Approval Dashboard
        </h1>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {pendingRecipes.length === 0 && !loading && (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-xl text-gray-600">
              No pending recipes to review
            </p>
          </div>
        )}

        <div className="space-y-6">
          {pendingRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <img
                  src={
                    recipe.image ||
                    "https://via.placeholder.com/400x300?text=No+Image+Available"
                  }
                  alt={recipe.title}
                  className="w-full md:w-1/3 object-cover h-64 md:h-auto"
                  onError={handleImageError}
                />
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
                    <div className="text-sm text-gray-500">
                      Submitted by: {recipe.user?.name || "Unknown User"}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{recipe.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Category:</h3>
                      <p>{recipe.category}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Prep Time:
                      </h3>
                      <p>{recipe.prepTime}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Servings:</h3>
                      <p>{recipe.servings}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Type:</h3>
                      <p>{recipe.isPremium ? "Premium" : "Free"}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => viewRecipeDetails(recipe)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      <FaInfoCircle className="inline mr-2" />
                      View Details
                    </button>

                    <div className="space-x-2">
                      <button
                        onClick={() => openApproveModal(recipe)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        <FaCheck className="inline mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => openRejectModal(recipe)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        <FaTimes className="inline mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for approval, rejection, or viewing details */}
      {showModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {actionType === "approve"
                  ? "Approve Recipe"
                  : actionType === "reject"
                  ? "Reject Recipe"
                  : "Recipe Details"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-bold">{selectedRecipe.title}</h3>
              <p className="text-gray-700">{selectedRecipe.description}</p>
            </div>

            {/* Recipe Details */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold">Category:</h4>
                  <p>{selectedRecipe.category}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Prep Time:</h4>
                  <p>{selectedRecipe.prepTime}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Servings:</h4>
                  <p>{selectedRecipe.servings}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Type:</h4>
                  <p>
                    {selectedRecipe.isPremium
                      ? `Premium ($${selectedRecipe.price})`
                      : "Free"}
                  </p>
                </div>
              </div>

              {/* Show ingredients and steps in view mode */}
              {actionType === "view" && (
                <>
                  <div className="mb-4">
                    <h4 className="font-semibold text-lg mb-2">Ingredients:</h4>
                    <ul className="list-disc pl-5">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-lg mb-2">Steps:</h4>
                    <ol className="list-decimal pl-5">
                      {selectedRecipe.steps.map((step, index) => (
                        <li key={index} className="mb-4">
                          <p>{step.description}</p>
                          {step.image && (
                            <img
                              src={step.image}
                              alt={`Step ${index + 1}`}
                              className="mt-2 rounded max-w-full h-auto"
                              onError={handleImageError}
                            />
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              )}
            </div>

            {/* Feedback Field (only for rejection) */}
            {actionType === "reject" && (
              <div className="mb-4">
                <label
                  htmlFor="adminFeedback"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Feedback for Rejection (Required):
                </label>
                <textarea
                  id="adminFeedback"
                  value={adminFeedback}
                  onChange={(e) => setAdminFeedback(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                  rows="4"
                  placeholder="Provide feedback to the recipe creator explaining why this recipe was rejected..."
                  required
                ></textarea>
              </div>
            )}

            {/* Action Buttons */}
            {actionType !== "view" && (
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={actionType === "reject" && !adminFeedback.trim()}
                  className={`px-4 py-2 rounded-lg text-white ${
                    actionType === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  } ${
                    actionType === "reject" && !adminFeedback.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {actionType === "approve"
                    ? "Confirm Approval"
                    : "Confirm Rejection"}
                </button>
              </div>
            )}

            {/* Close Button (only for view mode) */}
            {actionType === "view" && (
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRecipeApproval;
