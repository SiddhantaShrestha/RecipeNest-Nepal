import { Register } from "../Schema/model.js";

// In authorized.js
const authorized = async (req, res, next) => {
  try {
    const userId = req._id;
    const user = await Register.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isAdmin) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "Not authorized. Admin access required.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Authorization error",
      error: error.message,
    });
  }
};

export default authorized;
