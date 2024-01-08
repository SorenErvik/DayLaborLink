// Import the Multer middleware for handling file uploads
const multer = require("multer");
const path = require("path");

// Configure Multer with options for storage and file filtering
module.exports = multer({
  // Use the default disk storage engine (no specific storage options)
  storage: multer.diskStorage({}),
  // Define a file filter function to allow only specific file types (jpg, jpeg, png)
  fileFilter: (req, file, cb) => {
    // Extract the file extension from the original file name
    let ext = path.extname(file.originalname);
    // Check if the file extension is supported
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }

    // Allow the file if it passes the checks
    cb(null, true);
  },
});
