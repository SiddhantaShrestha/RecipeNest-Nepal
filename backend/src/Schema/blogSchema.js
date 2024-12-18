import mongoose from "mongoose";

// Define a sub-schema for comments
export const commentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  text: {
    type: String,
    required: true,
    minlength: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the current timestamp
  },
});

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Beginner",
        "Cuisine",
        "Health",
        "Dessert",
        "Tips",
        "Snacks",
        "Vegetarian",
        "Vegan",
        "Breakfast",
        "Lunch",
        "Dinner",
        "Gluten-Free",
        "Keto",
        "International",
        "Nepali",
        "Quick Meals",
        "Meal Prep",
        "Festive",
        "Street Food",
        "Baking",
        "Low Carb",
        "High Protein",
        "Seafood",
        "Soups & Stews",
        "Pasta & Noodles",
        "Drinks & Beverages",
        "Comfort Food",
        "Family Friendly",
        "Budget-Friendly",
        "Food Culture",
        "Fusion",
        "Sides & Appetizers",
        "Grilling & BBQ",
        "Spicy",
        "Cooking Techniques",
        "Dietary Restrictions",
      ],
    },
    image: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (v) {
      //     return /^(http|https):\/\/[^ "]+$/.test(v); // Validate URL format
      //   },
      //   message: "Invalid URL format for image",
      // },
    },
    creator: {
      type: mongoose.Types.ObjectId, // Reference to the user who created the blog
      ref: "Register",
      required: true,
    },
    comments: [commentSchema], // Array of comments
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

export default blogSchema;
