import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { password, secretKey } from "../constant.js";
import { Register } from "../Schema/model.js";
import { sendMail } from "../utils/sendMail.js";

export let createRegister = async (req, res) => {
  try {
    let data = req.body;

    // Check if email already exists
    let existingEmailUser = await Register.findOne({ email: data.email });
    if (existingEmailUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use.",
      });
    }

    // Check if contact number already exists
    let existingContactUser = await Register.findOne({ contact: data.contact });
    if (existingContactUser) {
      return res.status(400).json({
        success: false,
        message: "Contact number is already in use.",
      });
    }

    // Hash the password
    let hashPassword = await bcrypt.hash(data.password, 10);

    // Set the user data
    data = {
      ...data,
      isVerifiedEmail: false,
      password: hashPassword,
    };

    // Create new user
    let result = await Register.create(data);

    // Generate token
    let infoObj = {
      _id: result._id,
    };

    let expiryInfo = {
      expiresIn: "5d",
    };

    let token = await jwt.sign(infoObj, secretKey, expiryInfo);

    // Send email with verification link
    await sendMail({
      from: "'RecipeNest Nepal' sidmarkys2004@gmail.com",
      to: [data.email],
      subject: "Account Created",
      html: `
        <h1>Your account has been created successfully.</h1>
        <a href="http://localhost:3000/verify-email?token=${token}">Click here to verify your email.</a>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Register created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    let tokenString = req.headers.authorization;
    let tokenArray = tokenString.split(" ");
    let token = tokenArray[1];
    // console.log(token);

    //verify token
    let infoObj = await jwt.verify(token, secretKey);
    let userId = infoObj._id;

    //Code to verify email
    let result = await Register.findByIdAndUpdate(
      userId,
      {
        isVerifiedEmail: true,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "email verified successfully",
    });
  } catch (error) {
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
            role: user.role, // Include the user's role in the token
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
  delete data.email;
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
