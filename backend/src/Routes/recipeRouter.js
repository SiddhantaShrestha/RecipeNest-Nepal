import { Router } from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
} from "../Controllers/recipeController.js";
import upload from "../Middleware/multer.js";

const recipeRouter = Router();

// Public route for fetching all recipes
recipeRouter.route("/").get(getRecipes);

// Public route for fetching a specific recipe by ID
recipeRouter.route("/:id").get(getRecipeById);

// Public route for creating a new recipe (main image + step images)
recipeRouter.route("/").post(
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "stepImages", maxCount: 10 },
  ]),
  createRecipe
);

export default recipeRouter;
