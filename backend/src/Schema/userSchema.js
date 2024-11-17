import { Schema } from "mongoose";

let registerSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "fullName is required."],
    },
    email: {
      type: String,
      required: [true, "email is required."],
    },

    contact: {
      type: String,
      required: [true, "contact is required."],
    },
    address: {
      type: String,
      // required: [true, "gender is required."],
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
      // required: [true, "role is required."],
    },
    isVerifiedEmail: {
      type: Boolean,
      default: "user",
      // required: [true, "isVerifiedEmail is required."],
    },
  },
  { timestamps: true }
);

export default registerSchema;
