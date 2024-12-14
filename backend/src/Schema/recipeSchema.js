import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    steps: [{ type: String, required: true }],
    category: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

export default recipeSchema;
