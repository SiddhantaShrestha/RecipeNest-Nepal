import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { password, secretKey } from "../constant.js";
import { Register } from "../Schema/model.js";
import { sendMail } from "../utils/sendMail.js";
import createToken from "../utils/createToken.js";

export let createRegister = async (req, res) => {
  try {
    let data = req.body;

    // Check if the request is from an existing admin
    if (req.user && req.user.isAdmin) {
      data.isAdmin = data.isAdmin || false;
    } else {
      data.isAdmin = false;
    }

    // Check if email already exists
    let existingEmailUser = await Register.findOne({ email: data.email });
    if (existingEmailUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use.",
      });
    }

    // Hash the password
    let hashPassword = await bcrypt.hash(data.password, 10);

    // Create new user document
    const userData = {
      ...data,
      isVerifiedEmail: false,
      password: hashPassword,
    };

    // Create new user
    let newUser = await Register.create(userData);

    // Generate token using only the user ID
    const token = createToken(newUser._id);

    // For debugging: log the token structure
    console.log("Token payload structure:", jwt.decode(token));

    // Send verification email
    try {
      await sendMail({
        from: "'RecipeNest Nepal' <sidmarkys2004@gmail.com>",
        to: [data.email],
        subject: "Account Created",
        html: `
          <h1>Your account has been created successfully.</h1>
          <a href="http://localhost:3000/verify-email?token=${token}">Click here to verify your email.</a>
        `,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Continue with registration even if email fails
    }

    // Return success response
    res.status(201).json({
      success: true,
      message:
        "User created successfully. Please check your email for verification.",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        isVerifiedEmail: newUser.isVerifiedEmail,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    let tokenString = req.headers.authorization;
    if (!tokenString || !tokenString.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided or invalid token format",
      });
    }

    let token = tokenString.split(" ")[1];
    console.log("Received token for verification:", token);

    // Verify token using the same SECRET_KEY
    let decoded = await jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded token:", decoded);

    // Extract the user ID from various possible token structures
    let userId;
    if (typeof decoded === "object") {
      // If decoded is an object, check various possible property names
      userId = decoded.userId || decoded.id || decoded._id || decoded.sub;

      // If we still don't have an ID but there's only one property in the object, try using that
      if (
        !userId &&
        Object.keys(decoded).length === 1 &&
        typeof Object.values(decoded)[0] === "string" &&
        !["iat", "exp", "nbf", "iss", "aud", "jti"].includes(
          Object.keys(decoded)[0]
        )
      ) {
        userId = Object.values(decoded)[0];
      }
    } else if (typeof decoded === "string") {
      // If decoded is directly a string, use it as the ID
      userId = decoded;
    }

    if (!userId) {
      console.log("Full decoded token content:", JSON.stringify(decoded));
      return res.status(401).json({
        success: false,
        message: "Invalid token structure - could not extract user ID",
      });
    }

    // Update user verification status
    let result = await Register.findByIdAndUpdate(
      userId,
      { isVerifiedEmail: true },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Updated user:", result);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let user = await Register.findOne({ email: email });

    if (user) {
      if (user.isVerifiedEmail) {
        let isValidpassword = await bcrypt.compare(password, user.password);
        if (isValidpassword) {
          let infoObj = {
            _id: user._id,
            isAdmin: user.isAdmin, // Include isAdmin in token
          };
          let expiryInfo = {
            expiresIn: "365d",
          };
          let token = await jwt.sign(infoObj, secretKey, expiryInfo);

          res.json({
            success: true,
            message: "user login successful.",
            data: user,
            token: token,
          });
        } else {
          let error = new Error("credential does not match");
          throw error;
        }
      } else {
        let error = new Error("credential does not match");
        throw error;
      }
    } else {
      let error = new Error("credential does not match.");
      throw error;
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const myProfile = async (req, res, next) => {
  let userId = req._id;
  try {
    let result = await Register.findById(userId);
    res.status(200).json({
      success: true,
      message: "register read successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "unable to read profile",
    });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    let _id = req._id;
    let data = req.body;
    delete data.email;
    delete data.password;

    let result = await Register.findByIdAndUpdate(_id, data, { new: true });
    res.status(201).json({
      success: true,
      message: "profile updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    let _id = req._id;
    // let data = req.body;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    // // let { oldPassword, newPassword } = req.body;
    let data = await Register.findById(_id); //find data of this id
    let hashPassword = data.password;
    let isValidPassword = await bcrypt.compare(oldPassword, hashPassword);
    if (isValidPassword) {
      let newHashPassword = await bcrypt.hash(newPassword, 10);
      let result = await Register.findByIdAndUpdate(
        _id,
        {
          password: newHashPassword,
        },
        { new: true }
      );
      res.status(201).json({
        success: true,
        message: "passowrd updated successfully",
        data: result,
      });
    } else {
      let error = new Error("Credintial does not match");
      throw error;
    }

    // console.log(data);

    // let hasCode = await bcrypt.hash(password, 10);
    // let isValidPAss = await bcrypt.compare(password, hasCode);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const readAllUser = async (req, res, next) => {
  try {
    let results = await Register.find({});
    res.status(200).json({
      success: true,
      message: "data read successfully",
      data: results,
    });
  } catch (error) {
    res.json({
      success: true,
      message: error.message,
    });
  }
};

export const readSpecificUser = async (req, res, next) => {
  try {
    let id = req.params.id;

    let result = await Register.findById(id);
    res.status(200).json({
      success: true,
      message: "user data read successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let updateSpecificUser = async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  // delete data.email;
  delete data.password;

  try {
    let result = await Register.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(201).json({
      success: true,
      message: "user data updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    let id = req.params.id;
    let data = req.body;

    let result = await Register.findByIdAndDelete(id, data, { new: true });
    res.status(200).json({
      success: true,
      message: "deleted succcessfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    let email = req.body.email;
    let result = await Register.findOne({ email: email });
    //result = null
    //result = {....}

    if (result) {
      //generate token
      let infoObj = {
        _id: result._id,
      };

      let expiryInfo = {
        expiresIn: "5d",
      };

      let token = await jwt.sign(infoObj, secretKey, expiryInfo);

      // sendMail
      await sendMail({
        from: "'RecipeNest Nepal' sidmarkys2004@gmail.com",
        to: email,
        subject: "Reset password",
        html: `
    <h1>Here is the link for your password reset. </h1>
    <a href="http://localhost:3000/reset-password?token=${token}">
    http://localhost:3000/reset-password?token=${token}
    </a>
    `,
      });
      res.status(200).json({
        success: true,
        message: "Password reset link has been sent successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "email does not exist",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    let _id = req._id;

    let password = req.body.password;
    console.log(password);
    let hashPassword = await bcrypt.hash(password, 10);

    let result = await Register.findByIdAndUpdate(
      _id,
      {
        password: hashPassword,
      },
      {
        new: true,
      }
    );

    res.status(201).json({
      success: true,
      message: "password reset successfully.",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req._id; // This comes from your isAuthenticated middleware

    const user = await Register.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const bookmarkIndex = user.bookmarkedRecipes.indexOf(recipeId);

    if (bookmarkIndex === -1) {
      // Add bookmark
      user.bookmarkedRecipes.push(recipeId);
      await user.save();

      res.status(200).json({
        success: true,
        isBookmarked: true,
        message: "Recipe bookmarked successfully",
      });
    } else {
      // Remove bookmark
      user.bookmarkedRecipes.splice(bookmarkIndex, 1);
      await user.save();

      res.status(200).json({
        success: true,
        isBookmarked: false,
        message: "Recipe removed from bookmarks",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookmarkedRecipes = async (req, res) => {
  console.log("getBookmarkedRecipes called with:", {
    userId: req._id,
    headers: req.headers,
  });

  try {
    if (!req._id) {
      console.log("No user ID in request");
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await Register.findById(req._id).populate("bookmarkedRecipes");
    console.log("User found:", !!user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bookmarked recipes fetched successfully",
      bookmarkedRecipes: user.bookmarkedRecipes,
    });
  } catch (error) {
    console.error("Error in getBookmarkedRecipes:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
