// Import the Cloudinary SDK
const cloudinary = require("cloudinary").v2;

// Load environment variables from the specified path
require("dotenv").config({ path: "./config/.env" });

// Configure Cloudinary with the provided API credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Export the configured Cloudinary instance for use in other modules
module.exports = cloudinary;
