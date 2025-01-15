import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recipes: [], // All recipes
  currentRecipe: null, // The currently viewed recipe
  isBookmarked: false, // Bookmark status of the current recipe
  userRecipes: [], // Recipes created by the logged-in user
  isLoading: false, // Loading state for async operations
  error: null, // Error message for API failures
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes(state, action) {
      state.recipes = action.payload;
    },
    addRecipe(state, action) {
      state.recipes.push(action.payload);
    },
    setCurrentRecipe(state, action) {
      state.currentRecipe = action.payload;
    },
    setBookmarkStatus(state, action) {
      state.isBookmarked = action.payload;
    },
    updateRecipe(state, action) {
      const updatedRecipe = action.payload;
      if (!updatedRecipe || !updatedRecipe._id) {
        console.error("Invalid recipe data received:", updatedRecipe);
        return;
      }

      // Update in the list of all recipes
      const index = state.recipes.findIndex(
        (recipe) => recipe._id === updatedRecipe._id
      );
      if (index !== -1) {
        state.recipes[index] = updatedRecipe;
      }

      // Update the current recipe if it's the same as the updated one
      if (
        state.currentRecipe &&
        state.currentRecipe._id === updatedRecipe._id
      ) {
        state.currentRecipe = updatedRecipe;
      }

      // Update in the user's recipes if applicable
      const userRecipeIndex = state.userRecipes.findIndex(
        (recipe) => recipe._id === updatedRecipe._id
      );
      if (userRecipeIndex !== -1) {
        state.userRecipes[userRecipeIndex] = updatedRecipe;
      }
    },
    setUserRecipes(state, action) {
      state.userRecipes = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    deleteRecipe(state, action) {
      const recipeId = action.payload;
      state.recipes = state.recipes.filter((recipe) => recipe._id !== recipeId);
      state.userRecipes = state.userRecipes.filter(
        (recipe) => recipe._id !== recipeId
      );
      if (state.currentRecipe && state.currentRecipe._id === recipeId) {
        state.currentRecipe = null;
      }
    },
  },
});

export const {
  setRecipes,
  addRecipe,
  setCurrentRecipe,
  setBookmarkStatus,
  updateRecipe,
  setUserRecipes,
  setLoading,
  setError,
  deleteRecipe,
} = recipesSlice.actions;

export default recipesSlice.reducer;
