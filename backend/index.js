import express, { json } from "express";
import cors from "cors";
import { port } from "./src/constant.js";
import connectDb from "./src/connectDb/connectmongoDb.js";
import bodyParser from "body-parser";
import registerRouter from "./src/Routes/registerRouter.js";
import blogRouter from "./src/Routes/blogRouter.js"; // Import the blogRouter
import recipeRouter from "./src/Routes/recipeRouter.js";
import FileRouter from "./src/Routes/fileRouter.js";

let expressApp = express();

// Middleware
expressApp.use(json());
expressApp.use(cors());
expressApp.use(express.static("./uploads/"));
// Connect to MongoDB
connectDb(); // Using PORT from dotenv file

// Test server with ping API
expressApp.get("/ping", (req, res) => {
  res.send("Test");
});

// Routes
expressApp.use("/register", registerRouter); // User registration routes
expressApp.use("/blogs", blogRouter); // Blog routes
expressApp.use("/recipes", recipeRouter); // Blog routes
expressApp.use("/file", FileRouter); // Blog routes

// Start server and log the port
expressApp.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
