import mongoose from "mongoose";

export const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Register", // Reference to your user model
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
    }, // Reference to user
    isPremium: {
      type: Boolean,
      default: false,
    },
    comments: [commentSchema],
  },

  { timestamps: true }
);

export default recipeSchema;
