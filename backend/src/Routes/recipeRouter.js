import { Router } from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
} from "../Controllers/recipeController.js";

const recipeRouter = Router();

// Public route for fetching all recipes
recipeRouter.route("/").get(getRecipes);

// Public route for fetching a specific recipe by ID
recipeRouter.route("/:id").get(getRecipeById);

// Public route for creating a new recipe
recipeRouter.route("/").post(createRecipe);

export default recipeRouter;
