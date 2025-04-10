import mongoose from "mongoose";

// Create a rating schema similar to the product review schema
export const recipeRatingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
      required: true,
    },
  },
  { timestamps: true }
);

// Keep your existing comment schema
export const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Register",
    required: true,
  },
  text: {
    type: String,
    required: true,
    minlength: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    // Add the ratings-related fields like in the product schema
    ratings: [recipeRatingSchema],
    rating: { type: Number, required: true, default: 0 },
    numRatings: { type: Number, required: true, default: 0 },
    // Keep the existing comments structure
    comments: [commentSchema],
  },
  { timestamps: true }
);

export const Recipe = mongoose.model("Recipe", recipeSchema);
export default recipeSchema;
