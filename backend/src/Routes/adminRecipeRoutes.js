import { Router } from "express";
import {
  getPendingRecipes,
  approveOrRejectRecipe,
} from "../Controllers/recipeController.js";
import isAuthenticated from "../Middleware/isAuthenticated.js";
import authorized from "../Middleware/authorized.js";

const adminRecipeRouter = Router();

// Approve or reject a recipe
adminRecipeRouter
  .route("/:id/review")
  .put(isAuthenticated, authorized, approveOrRejectRecipe);

export default adminRecipeRouter;
