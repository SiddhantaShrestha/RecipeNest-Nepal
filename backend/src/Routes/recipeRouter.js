import { Router } from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  getRecipesByUser,
  updateRecipe,
  deleteRecipe,
  addComment,
  addRecipeRating, // Add the new controller function
} from "../Controllers/recipeController.js";
import upload from "../Middleware/multer.js";
import isAuthenticated from "../Middleware/isAuthenticated.js";
import { checkPremiumStatus } from "../Middleware/premiumCheck.js";

const recipeRouter = Router();

// Protected route for fetching recipes created by the logged-in user
recipeRouter.route("/my-recipes").get(isAuthenticated, getRecipesByUser);

// Public route for fetching all recipes
recipeRouter.route("/").get(checkPremiumStatus, getRecipes);

// Protected route for creating a new recipe
recipeRouter.route("/").post(
  isAuthenticated,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "stepImages", maxCount: 10 },
  ]),
  createRecipe
);

// Public route for fetching a specific recipe by ID
recipeRouter.route("/:id").get(checkPremiumStatus, getRecipeById);

// Protected route for updating a recipe
recipeRouter.route("/:id").put(
  isAuthenticated,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "stepImages", maxCount: 10 },
  ]),
  updateRecipe
);

// Protected route for deleting a recipe
recipeRouter.route("/:id").delete(isAuthenticated, deleteRecipe);

// Protected route for adding comments
recipeRouter.route("/:id/comments").post(isAuthenticated, addComment);

// Protected route for adding ratings
recipeRouter.route("/:id/ratings").post(isAuthenticated, addRecipeRating);

export default recipeRouter;
