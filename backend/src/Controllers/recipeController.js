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

    // Parse ingredients and steps
    const parsedIngredients =
      typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

    const parsedSteps =
      typeof rawSteps === "string" ? JSON.parse(rawSteps) : rawSteps;

    // Get server's base URL
    const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

    // Handle images
    const mainImagePath = req.files.mainImage?.[0]
      ? `${BASE_URL}/${req.files.mainImage[0].filename}`
      : "";

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
      user: req._id, // Assign the logged-in user's ID
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

export const getRecipesByUser = async (req, res) => {
  try {
    const userId = req._id; // Use the logged-in user's ID

    const recipes = await Recipe.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Recipes fetched successfully",
      recipes,
    });
  } catch (error) {
    console.error("Error fetching user-specific recipes:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recipes",
      error: error.message,
    });
  }
};

export const updateRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the recipe by ID
    const recipe = await Recipe.findById(id);

    // Check if the recipe exists
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the logged-in user is the owner of the recipe
    if (recipe.user.toString() !== req._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this recipe" });
    }

    const {
      title,
      description,
      ingredients,
      steps: rawSteps,
      category,
      prepTime,
      servings,
    } = req.body;

    // Parse ingredients and steps
    const parsedIngredients =
      typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

    const parsedSteps =
      typeof rawSteps === "string" ? JSON.parse(rawSteps) : rawSteps;

    // Get server's base URL
    const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

    // Handle images
    const mainImagePath = req.files.mainImage?.[0]
      ? `${BASE_URL}/${req.files.mainImage[0].filename}`
      : null;

    const formattedSteps = parsedSteps.map((step, index) => ({
      description: step.description,
      image: req.files.stepImages?.[index]
        ? `${BASE_URL}/${req.files.stepImages[index].filename}`
        : step.image, // Retain existing image if no new image is uploaded
    }));

    const updatedData = {
      title,
      description,
      ingredients: parsedIngredients,
      steps: formattedSteps,
      category,
      prepTime,
      servings: Number(servings),
    };

    if (mainImagePath) {
      updatedData.image = mainImagePath;
    }

    // Update the recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({
      success: false,
      message: "Error updating recipe",
      error: error.message,
    });
  }
};

export const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the recipe by ID
    const recipe = await Recipe.findById(id);

    // Check if the recipe exists
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the logged-in user is the owner of the recipe
    if (recipe.user.toString() !== req._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this recipe" });
    }

    // Delete the recipe
    await Recipe.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting recipe",
      error: error.message,
    });
  }
};
