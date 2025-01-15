import mongoose, { Schema } from "mongoose";

let registerSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "fullName is required."],
    },
    username: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      required: [true, "email is required."],
      unique: true,
    },
    contact: {
      type: String,
      required: [true, "contact is required."],
      unique: true,
    },
    dob: {
      type: String,
      required: [true, "dob is required."],
    },
    password: {
      type: String,
      required: [true, "password is required."],
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    isVerifiedEmail: {
      type: Boolean,
      default: false,
    },
    bookmarkedRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  { timestamps: true }
);

export default registerSchema;
