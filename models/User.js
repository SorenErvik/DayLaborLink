// Import necessary modules: bcrypt for password hashing and mongoose for MongoDB schema creation
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Define the schema for the "User" model
const UserSchema = new mongoose.Schema({
  // User's username (String, unique)
  userName: { type: String, unique: true },
  // User's email address (String, unique)
  email: { type: String, unique: true },
  // Hashed password for user authentication
  password: String,
  // Type of user: "contractor" or "laborer" (String, enum)
  userType: { type: String, enum: ['contractor', 'laborer'] }, //Add userType property
  // Array of skills associated with the user (String)
  skills: [String],
  // Array of post references that the user has favorited
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // Array of Post references
});

// Password hash middleware: Hashes the user's password before saving to the database
UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password during login
UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

// Create and export the "User" model based on the defined schema
module.exports = mongoose.model("User", UserSchema);
