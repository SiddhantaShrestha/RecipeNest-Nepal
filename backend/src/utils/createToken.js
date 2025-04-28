import jwt from "jsonwebtoken";
import { secretKey } from "../constant.js";

const createToken = (userId) => {
  try {
    return jwt.sign(
      { _id: userId.toString() }, // Ensure userId is a string
      secretKey,
      { expiresIn: "24h" }
    );
  } catch (error) {
    // console.error("Token creation error:", error);
    throw new Error("Failed to create authentication token");
  }
};

export default createToken;
