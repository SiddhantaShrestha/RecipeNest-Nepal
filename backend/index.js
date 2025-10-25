import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { port } from "./src/constant.js";
import connectDb from "./src/connectDb/connectmongoDb.js";
import registerRouter from "./src/Routes/registerRouter.js";
import blogRouter from "./src/Routes/blogRouter.js";
import recipeRouter from "./src/Routes/recipeRouter.js";
import orderRoutes from "./src/Routes/orderRoutes.js";
import FileRouter from "./src/Routes/fileRouter.js";
import categoryRouter from "./src/Routes/categoryRouter.js";
import productRoutes from "./src/Routes/productRoutes.js";
import uploadRoutes from "./src/Routes/uploadRoutes.js";
import esewaRoutes from "./src/Routes/eSewaRoutes.js";
import premiumRoutes from "./src/Routes/premiumRoutes.js";
import userSalesRoutes from "./src/Routes/userSalesRoutee.js";

const app = express();

// ---------- Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS (dev: localhost:3000; prod: your domain)
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.CLIENT_ORIGIN, // e.g. https://recipenestnepal.com (set in prod)
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser requests (e.g. curl, server-to-server)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---------- Connect DB
connectDb();

// ---------- Static folders (uploads)
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Health check
app.get("/ping", (_req, res) => res.send("OK"));

// ---------- API routes
app.use("/api/users", registerRouter);
app.use("/blogs", blogRouter);
app.use("/recipes", recipeRouter);
app.use("/file", FileRouter);
app.use("/api/category", categoryRouter);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user-sales", userSalesRoutes);
app.use("/api/esewa", esewaRoutes);
app.use("/api/premium", premiumRoutes);

// ---------- Serve frontend build (we'll copy it to backend/public at build time)
const FRONTEND_DIR = path.join(__dirname, "backend", "public"); // NOTE: when running from repo root in some hosts
// If you run the app from backend folder directly, use: path.join(__dirname, "public")

app.use(express.static(FRONTEND_DIR));

// Catch-all for client-side routing (AFTER API routes)
app.get("*", (req, res) => {
  // don't hijack API or uploads
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
    return res.status(404).send("Not found");
  }
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// ---------- Start
const PORT = process.env.PORT || port || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
