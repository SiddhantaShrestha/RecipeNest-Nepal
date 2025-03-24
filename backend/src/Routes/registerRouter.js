import { Router } from "express";
import {
  createRegister,
  deleteUser,
  forgotPassword,
  getBookmarkedRecipes,
  getPremiumStatus,
  initiatePremiumUpgrade,
  loginUser,
  myProfile,
  readAllUser,
  readSpecificUser,
  resetPassword,
  toggleBookmark,
  updatePassword,
  updateProfile,
  updateSpecificUser,
  verifyEmail,
  verifyPremiumUpgrade,
} from "../Controllers/registerController.js";
import isAuthenticated from "../Middleware/isAuthenticated.js";
import validation from "../Middleware/validation.js";
import registerValidation from "../validation/registerValidation.js";
import authorized from "../Middleware/authorized.js";
import isPremiumUser from "../Middleware/isPremiumUser.js";

//Register.create(data)
//Register.find({})
//Register.findById(id)
//Register.findByIdAndDelete(id)
//Register.findByIdAndUpdate(id, data, {new:true})

const registerRouter = Router();
registerRouter
  .route("/") //localhost:8000/registers
  .post(validation(registerValidation), createRegister)
  .get(readAllUser);

registerRouter.route("/verify-email").patch(verifyEmail);

registerRouter.route("/login").post(loginUser);

registerRouter.route("/my-profile").get(isAuthenticated, myProfile); //first thing in parameter in middleware folder and second thing in controller folder

registerRouter.route("/update-profile").patch(isAuthenticated, updateProfile);

registerRouter.route("/update-password").patch(isAuthenticated, updatePassword);

registerRouter.route("/forgot-password").post(forgotPassword);

registerRouter.route("/reset-password").patch(isAuthenticated, resetPassword);

registerRouter.route("/toggle-bookmark").post(isAuthenticated, toggleBookmark);

registerRouter.route("/bookmarks").get(isAuthenticated, getBookmarkedRecipes);

registerRouter
  .route("/:id")
  .get(isAuthenticated, authorized, readSpecificUser)
  .patch(isAuthenticated, authorized, updateSpecificUser)
  .delete(isAuthenticated, authorized, deleteUser);

registerRouter.route("/bookmarks").get(
  (req, res, next) => {
    console.log("Pre-auth middleware hit");
    next();
  },
  isAuthenticated,
  (req, res, next) => {
    console.log("Post-auth middleware hit");
    next();
  },
  getBookmarkedRecipes
);

export default registerRouter;

// admin => user read
// superadmin => user read, delete user
// customer => does not have permission to read user
