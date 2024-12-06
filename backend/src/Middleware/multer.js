import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get the current directory using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads folder exists
const uploadsDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // Create the uploads folder if it doesn't exist
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Destination:", uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    console.log("Filename:", uniqueName);
    cb(null, uniqueName);
  },
});

// Define the upload middleware with file size and file filter checks
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB size limit
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimeType && extName) {
      return cb(null, true); // File type is valid
    } else {
      return cb(new Error("Only JPEG and PNG files are allowed.")); // Invalid file type
    }
  },
});

export default upload;
