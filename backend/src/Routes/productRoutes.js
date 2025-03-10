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
} from "../Controllers/productController.js";

import isAuthenticated from "../Middleware/isAuthenticated.js";
import authorized from "../Middleware/authorized.js";
import checkId from "../Middleware/checkId.js";

router
  .route("/")
  .get(fetchProducts)
  .post(isAuthenticated, authorized, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);
router
  .route("/:id/reviews")
  .post(isAuthenticated, authorized, addProductReview);

router
  .route("/:id")
  .get(fetchProductById)
  .put(isAuthenticated, authorized, formidable(), updateProductDetails)
  .delete(isAuthenticated, authorized, removeProduct);
router.route("/:id").delete(isAuthenticated, authorized, removeProduct);

export default router;
