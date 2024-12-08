import mongoose from "mongoose";

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
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v); // Validate URL format
        },
        message: "Invalid URL format for image",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default blogSchema;
