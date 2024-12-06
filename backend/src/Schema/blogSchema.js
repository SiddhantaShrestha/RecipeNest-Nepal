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
      enum: ["Beginner", "Cuisine", "Health", "Dessert", "Tips"],
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
