import express from "express";
import formidable from "express-formidable";
const router = express.Router();

//controllers
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../Controllers/productController.js";

import isAuthenticated from "../Middleware/isAuthenticated.js";
import authorized from "../Middleware/authorized.js";
import checkId from "../Middleware/checkId.js";
import upload from "../Middleware/multer.js";

router.route("/").get(fetchProducts).post(
  isAuthenticated,
  authorized,
  formidable(),
  // upload.single("image"),
  addProduct
);

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(isAuthenticated, checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(isAuthenticated, authorized, formidable(), updateProductDetails)
  .delete(isAuthenticated, authorized, removeProduct);

router.route("/filtered-products").post(filterProducts);

export default router;
