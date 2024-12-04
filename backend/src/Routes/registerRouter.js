import { Router } from "express";
import {
  createRegister,
  deleteUser,
  forgotPassword,
  loginUser,
  myProfile,
  readAllUser,
  readSpecificUser,
  resetPassword,
  updatePassword,
  updateProfile,
  updateSpecificUser,
  verifyEmail,
} from "../Controllers/registerController.js";
import isAuthenticated from "../Middleware/isAuthenticated.js";
import validation from "../Middleware/validation.js";
import registerValidation from "../validation/registerValidation.js";
import authorized from "../Middleware/authorized.js";

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

registerRouter
  .route("/:id")
  .get(isAuthenticated, authorized(["admin", "superadmin"]), readSpecificUser)
  .patch(
    isAuthenticated,
    authorized(["admin", "superadmin"]),
    updateSpecificUser
  ) // Admin and superadmin can update without token
  .delete(isAuthenticated, authorized(["superadmin"]), deleteUser);

export default registerRouter;

// admin => user read
// superadmin => user read, delete user
// customer => does not have permission to read user
