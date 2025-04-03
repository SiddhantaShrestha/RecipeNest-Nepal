import mongoose from "mongoose";
import asyncHandler from "../Middleware/asyncHandler.js";
import Product from "../Schema/productSchema.js";

// User submits a product for approval
const submitProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    // Create product with user as submitter and pending approval status
    const product = new Product({
      ...req.fields,
      submittedBy: req.user._id,
      isApproved: false,
      approvalStatus: "pending",
    });

    await product.save();
    res.status(201).json({
      success: true,
      message: "Product submitted for approval",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// Admin only - adds product directly (no approval needed)
const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = new Product({
      ...req.fields,
      submittedBy: req.user._id,
      isApproved: true,
      approvalStatus: "approved",
    });

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// Admin approves or rejects a submitted product
const reviewProductSubmission = asyncHandler(async (req, res) => {
  try {
    const { approvalStatus, adminFeedback, rating } = req.body;

    if (!["approved", "rejected"].includes(approvalStatus)) {
      return res.status(400).json({ error: "Invalid approval status" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update product approval status
    product.approvalStatus = approvalStatus;
    product.isApproved = approvalStatus === "approved";
    product.adminFeedback = adminFeedback || "";

    // If there's admin feedback, add it as a review
    if (adminFeedback && adminFeedback.trim().length > 0) {
      // Create admin review
      const adminReview = {
        name: "Admin",
        rating: Number(rating) || 5, // Use provided rating or default to 5
        comment: adminFeedback,
        user: req.user._id,
      };

      // Add the admin review to the reviews array
      product.reviews.push(adminReview);

      // Update review count
      product.numReviews = product.reviews.length;

      // Recalculate average rating
      product.rating =
        product.reviews.reduce((acc, item) => acc + Number(item.rating), 0) /
        product.reviews.length;
    }

    await product.save();

    res.json({
      success: true,
      message: `Product ${approvalStatus}`,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Get pending product submissions for admin review
const fetchPendingProducts = asyncHandler(async (req, res) => {
  try {
    const pendingProducts = await Product.find({ approvalStatus: "pending" })
      .populate("category")
      .populate("submittedBy", "username email");

    res.json(pendingProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get user's submitted products (approved, pending, rejected)
const fetchUserSubmittedProducts = asyncHandler(async (req, res) => {
  try {
    const userProducts = await Product.find({
      submittedBy: req.user._id,
    }).populate("category");

    res.json(userProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the user is admin or the original submitter
    const isAdmin = req.user.isAdmin;
    const isSubmitter =
      product.submittedBy.toString() === req.user._id.toString();

    if (!isAdmin && !isSubmitter) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this product" });
    }

    // If user is updating their product and it was already approved, reset to pending
    if (!isAdmin && isSubmitter && product.approvalStatus === "approved") {
      product.approvalStatus = "pending";
      product.isApproved = false;
    }

    // Update product fields
    Object.keys(req.fields).forEach((key) => {
      product[key] = req.fields[key];
    });

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the user is admin or the original submitter
    const isAdmin = req.user.isAdmin;
    const isSubmitter =
      product.submittedBy.toString() === req.user._id.toString();

    if (!isAdmin && !isSubmitter) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    // Only show approved products to general users
    const approvedFilter = { isApproved: true };
    const combinedFilter = { ...keyword, ...approvedFilter };

    const count = await Product.countDocuments(combinedFilter);
    const products = await Product.find(combinedFilter).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // If product is not approved, only allow admin or submitter to view it
    if (!product.isApproved) {
      // Check if user is logged in and is admin or submitter
      const isAdmin = req.user && req.user.isAdmin;
      const isSubmitter =
        req.user && product.submittedBy.toString() === req.user._id.toString();

      if (!isAdmin && !isSubmitter) {
        res.status(403);
        throw new Error("This product is pending approval");
      }
    }

    return res.json(product);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message || "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    // Only show approved products to general users unless they're an admin
    const isAdmin = req.user && req.user.isAdmin;
    const filter = isAdmin ? {} : { isApproved: true };

    const products = await Product.find(filter)
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // Only allow reviews on approved products
      if (!product.isApproved) {
        res.status(403);
        throw new Error("Cannot review a product that is not approved");
      }

      // First check if already reviewed
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      // Fetch the complete user data
      const userData = await mongoose.model("Register").findById(req.user._id);

      if (!userData) {
        res.status(404);
        throw new Error("User not found");
      }

      // Create review with the complete user data
      const review = {
        name: userData.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      // Add the review
      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      // Calculate the new average rating
      product.rating =
        product.reviews.reduce((acc, item) => acc + Number(item.rating), 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    // Only include approved products in top products
    const products = await Product.find({ isApproved: true })
      .sort({ rating: -1 })
      .limit(4);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    // Only include approved products in new products
    const products = await Product.find({ isApproved: true })
      .sort({ _id: -1 })
      .limit(5);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = { isApproved: true }; // Only include approved products in filters

    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

export {
  addProduct, // Admin only - direct product creation
  submitProduct, // User submission for approval
  reviewProductSubmission, // Admin approval/rejection
  fetchPendingProducts, // Get pending products for admin
  fetchUserSubmittedProducts, // Get user's submitted products
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
