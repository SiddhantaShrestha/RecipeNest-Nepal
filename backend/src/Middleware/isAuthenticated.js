import jwt from "jsonwebtoken";
import { secretKey } from "../constant.js";

let isAuthenticated = async (req, res, next) => {
  try {
    // console.log("Headers received:", req.headers);
    const tokenString = req.headers.authorization;

    if (!tokenString || !tokenString.startsWith("Bearer ")) {
      // console.log("Token string invalid:", { tokenString });
      return res.status(401).json({
        success: false,
        message: "Not authenticated: Please login to continue",
      });
    }

    const token = tokenString.split(" ")[1];
    const decoded = await jwt.verify(token, secretKey);

    // Pass both ID and role to the request object
    req.user = decoded;
    req._id = decoded._id;
    req.isAdmin = decoded.isAdmin;

    // console.log("Authenticated user:", { id: req._id, role: req.isAdmin });

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or malformed token",
      error: error.message,
    });
  }
};

export default isAuthenticated;
