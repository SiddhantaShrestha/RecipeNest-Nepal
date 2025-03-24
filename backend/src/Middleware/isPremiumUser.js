import Register from "../Schema/userSchema.js";

export const isPremiumUser = async (req, res, next) => {
  try {
    const userId = req._id;
    const user = await Register.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if premium is active
    const isPremiumActive =
      user.isPremium &&
      user.premiumExpiryDate &&
      new Date(user.premiumExpiryDate) > new Date();

    if (!isPremiumActive) {
      return res.status(403).json({
        success: false,
        message: "Premium access required",
        requiresPremium: true,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking premium status",
    });
  }
};

export default isPremiumUser;
