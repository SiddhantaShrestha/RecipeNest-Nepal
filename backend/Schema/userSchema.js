//Creating schema

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
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
      type: Date,
      // required: [true, "dob is required."],
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
    isVerifiedEmail: {
      type: Boolean,
      // required: [true, "isVerifiedEmail is required."],
    },
  },
  { timestamps: true }
);

export default UserSchema;
