export const checkPremiumStatus = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("Token:", token); // Log the token

    if (!token) {
      // console.log("No token provided");
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token:", decoded);

    const user = await Register.findById(decoded.id);
    // console.log("Found User:", user);

    if (user) {
      req.user = {
        id: user._id,
        isPremium: user.isPremium,
        premiumExpiryDate: user.premiumExpiryDate,
      };
    }

    next();
  } catch (error) {
    console.error("Premium check error:", error);
    next();
  }
};
