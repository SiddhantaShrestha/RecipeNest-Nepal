import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    steps: [
      {
        description: { type: String, required: true },
        image: { type: String }, // Optional image URL for the step
      },
    ],
    category: { type: String, required: true },
    prepTime: { type: String, required: true }, // New field: Preparation time
    servings: { type: Number, required: true }, // New field: Serving size
    image: { type: String },
  },
  { timestamps: true }
);

export default recipeSchema;
