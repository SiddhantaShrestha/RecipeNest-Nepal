import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    steps: [
      {
        description: { type: String, required: true },
        image: { type: String }, // Step image (this is optional)
      },
    ],
    category: { type: String, required: true },
    prepTime: { type: String, required: true },
    servings: { type: Number, required: true },
    image: { type: String, required: true }, // Main image as a single string
  },
  { timestamps: true }
);

export default recipeSchema;
