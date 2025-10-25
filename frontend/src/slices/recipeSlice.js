import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../api";

const initialState = {
  recipes: [],
  currentRecipe: null,
  isBookmarked: false,
  userRecipes: [],
  isLoading: false,
  error: null,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes(state, action) {
      state.recipes = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addRecipe(state, action) {
      state.recipes.unshift(action.payload);
      state.userRecipes.unshift(action.payload);
      state.isLoading = false;
      state.error = null;
    },
    setCurrentRecipe(state, action) {
      state.currentRecipe = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setBookmarkStatus(state, action) {
      state.isBookmarked = action.payload;
    },
    updateRecipe(state, action) {
      const updatedRecipe = action.payload;

      // Update in recipes array
      state.recipes = state.recipes.map((recipe) =>
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      );

      // Update in userRecipes if exists
      state.userRecipes = state.userRecipes.map((recipe) =>
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      );

      // Update currentRecipe if it's the one being updated
      if (state.currentRecipe?._id === updatedRecipe._id) {
        state.currentRecipe = updatedRecipe;
      }

      state.isLoading = false;
      state.error = null;
    },
    setUserRecipes(state, action) {
      state.userRecipes = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    deleteRecipe(state, action) {
      const recipeId = action.payload;
      state.recipes = state.recipes.filter((recipe) => recipe._id !== recipeId);
      state.userRecipes = state.userRecipes.filter(
        (recipe) => recipe._id !== recipeId
      );
      if (state.currentRecipe?._id === recipeId) {
        state.currentRecipe = null;
      }
      state.isLoading = false;
      state.error = null;
    },
  },
});

// Export regular actions
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

// Export async action creators (manual thunks)
export const fetchRecipes = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get("/recipes");
    dispatch(setRecipes(response.data.recipes || []));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to fetch recipes")
    );
  }
};

export const fetchRecipeById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`/recipes/${id}`);
    dispatch(setCurrentRecipe(response.data.recipe));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to fetch recipe")
    );
  }
};

export const createRecipe = (recipeData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post("/recipes", recipeData);
    dispatch(addRecipe(response.data.recipe));
    return response.data.recipe; // Return for component to use
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to create recipe")
    );
    throw error; // Re-throw for component to handle
  }
};

export const updateExistingRecipe = (id, recipeData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.put(`/recipes/${id}`, recipeData);
    dispatch(updateRecipe(response.data.recipe));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to update recipe")
    );
  }
};

export const removeRecipe = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axios.delete(`/recipes/${id}`);
    dispatch(deleteRecipe(id));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to delete recipe")
    );
  }
};

export default recipesSlice.reducer;
