import jwt from "jsonwebtoken";
import { secretKey } from "../constant.js";

let isAuthenticated = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;

    if (!tokenString || !tokenString.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing or invalid format",
      });
    }

    const token = tokenString.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }

    const user = await jwt.verify(token, secretKey);
    req._id = user._id;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or malformed token",
    });
  }
};

export default isAuthenticated;
