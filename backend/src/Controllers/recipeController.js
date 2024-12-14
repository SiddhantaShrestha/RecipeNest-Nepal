import { Recipe } from "../Schema/model.js";

// Create a new recipe
export const createRecipe = async (req, res) => {
  const { title, description, ingredients, steps, category, image } = req.body;

  try {
    const newRecipe = new Recipe({
      title,
      description,
      ingredients,
      steps,
      category,
      image,
    });
    await newRecipe.save();

    res.status(201).json({
      message: "Recipe added successfully",
      recipe: newRecipe,
    });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ message: "Server error" });
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
