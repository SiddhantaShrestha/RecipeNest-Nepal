import express from "express";
const router = express.Router();
import isAuthenticated from "../Middleware/isAuthenticated.js";
import authorized from "../Middleware/authorized.js";
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../Controllers/categoryController.js";

router.route("/").post(isAuthenticated, authorized, createCategory);
router.route("/:categoryId").put(isAuthenticated, authorized, updateCategory);
router
  .route("/:categoryId")
  .delete(isAuthenticated, authorized, removeCategory);
router.route("/categories").get(listCategory);
router.route("/:id").get(readCategory);

export default router;
