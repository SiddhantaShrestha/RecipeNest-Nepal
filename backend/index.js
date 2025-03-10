import express, { json } from "express";
import cors from "cors";
import { port } from "./src/constant.js";
import connectDb from "./src/connectDb/connectmongoDb.js";
import bodyParser from "body-parser";
import registerRouter from "./src/Routes/registerRouter.js";
import blogRouter from "./src/Routes/blogRouter.js"; // Import the blogRouter
import recipeRouter from "./src/Routes/recipeRouter.js";
import FileRouter from "./src/Routes/fileRouter.js";
import cookieParser from "cookie-parser";
import categoryRouter from "./src/Routes/categoryRouter.js";
import productRoutes from "./src/Routes/productRoutes.js";

let expressApp = express();

// Middleware
expressApp.use(json());
expressApp.use(cors());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(cookieParser());
expressApp.use(express.static("./uploads/"));
// Connect to MongoDB
connectDb(); // Using PORT from dotenv file

// Test server with ping API
expressApp.get("/ping", (req, res) => {
  res.send("Test");
});

expressApp.use(
  cors({
    origin: "http://localhost:3000", // Frontend origin
    credentials: true, // Allow cookies and headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
expressApp.use("/api/users", registerRouter); // User registration routes
expressApp.use("/blogs", blogRouter); // Blog routes
expressApp.use("/recipes", recipeRouter); // Blog routes
expressApp.use("/file", FileRouter); // Blog routes
expressApp.use("/api/category", categoryRouter);
expressApp.use("/api/products", productRoutes);

// Start server and log the port
expressApp.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
