import { Router } from "express";
import {
  createFile,
  createMultipleFile,
} from "../Controllers/fileController.js";
import upload from "../Middleware/multer.js";
// import {
//   createFile,
//   updateFile,
//   getFile,
//   getFileById,
//   deleteFile,
//   getMyFile,
// } from "../Controllers/FileController.js";

// import upload from "../Middleware/multer.js";
// import validation from "../Middleware/validation.js";
// import {
//   FileCreationValidation,
//   FileUpdateValidation,
// } from "../validation/FileValidation.js";

const FileRouter = Router();

// Protected route for creating a File
FileRouter.route("/single").post(upload.single("file"), createFile);
FileRouter.route("/multiple").post(upload.array("file"), createMultipleFile);

export default FileRouter;
