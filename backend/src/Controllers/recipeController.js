import { Recipe } from "../Schema/model.js";

// Create a new recipe
export const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps: rawSteps,
      category,
      prepTime,
      servings,
    } = req.body;

    // Parse ingredients if it comes as a string
    const parsedIngredients =
      typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

    // Parse steps if it comes as a string
    const parsedSteps =
      typeof rawSteps === "string" ? JSON.parse(rawSteps) : rawSteps;

    // Get your server's base URL from environment variables
    const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

    // Handle main image
    const mainImagePath = req.files.mainImage?.[0]
      ? `${BASE_URL}/${req.files.mainImage[0].filename}`
      : "";

    // Handle step images and combine with step descriptions
    const formattedSteps = parsedSteps.map((step, index) => ({
      description: step.description,
      image: req.files.stepImages?.[index]
        ? `${BASE_URL}/${req.files.stepImages[index].filename}`
        : "",
    }));

    // Create new recipe
    const newRecipe = new Recipe({
      title,
      description,
      ingredients: parsedIngredients,
      steps: formattedSteps,
      category,
      prepTime,
      servings: Number(servings),
      image: mainImagePath,
    });

    await newRecipe.save();

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      recipe: newRecipe,
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({
      success: false,
      message: "Error creating recipe",
      error: error.message,
    });
  }
};

// Get all recipes
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 }); // Sort by most recent
    res.status(200).json({
      message: "Recipes fetched successfully",
      recipes,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single recipe by ID
export const getRecipeById = async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({
      message: "Recipe fetched successfully",
      recipe,
    });
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};
