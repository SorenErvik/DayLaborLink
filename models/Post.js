// Import the Mongoose library for MongoDB schema creation
const mongoose = require("mongoose");

// Define the schema for the "Post" model
const PostSchema = new mongoose.Schema({
  // Title of the post (String, required field)
  title: {
    type: String,
    required: true,
  },
  // URL or path to the image associated with the post (String, required field)
  image: {
    type: String,
    require: true,
  },
  // Cloudinary ID associated with the uploaded image (String, required field)
  cloudinaryId: {
    type: String,
    require: true,
  },
  // Caption or description for the post (String, required field)
  caption: {
    type: String,
    required: true,
  },
  // Number of favorites or likes for the post (Number, required field)
  favorites: {
    type: Number,
    required: true,
  },
  // Reference to the user who created the post (ObjectId, ref: "User")
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // Date and time when the post was created (Date, default: Date.now)
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Type of the post, e.g., "contractor" or "laborer" (String, required field)
  postType: {
    type: String,
    required: true,
  },
});

// Create and export the "Post" model based on the defined schema
module.exports = mongoose.model("Post", PostSchema);
