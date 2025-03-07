import express from "express";
const router = express.Router();
import isAuthenticated from "../Middleware/isAuthenticated.js";
import authorized from "../Middleware/authorized.js";
import {
  createCategory,
  updateCategory,
} from "../Controllers/categoryController.js";

router.route("/").post(isAuthenticated, authorized, createCategory);
router.route("/:categoryId").put(isAuthenticated, authorized, updateCategory);

export default router;
