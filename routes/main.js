// Import necessary modules: express for creating routes and controllers for handling route logic
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth"); // Import authentication controller
const homeController = require("../controllers/home"); // Import home controller
const postsController = require("../controllers/posts"); // Import posts controller
const { ensureAuth, ensureGuest } = require("../middleware/auth"); // Import authentication middleware

//Main Routes - simplified for now
router.get("/", homeController.getIndex); // Route for the home page
router.get("/profile", ensureAuth, postsController.getProfile); // Route for user profile (authenticated access only)
router.get("/contractor-profile", ensureAuth, postsController.getContractorProfile); // Route for contractor profile (authenticated access only)
router.get("/laborer-profile", ensureAuth, postsController.getLaborerProfile); // Route for laborer profile (authenticated access only)
router.get("/contractor-feed", ensureAuth, postsController.getContractorFeed); // Route for contractor feed (authenticated access only)
router.get("/laborer-feed", ensureAuth, postsController.getLaborerFeed); // Route for laborer feed (authenticated access only)
router.get("/feed", ensureAuth, postsController.getFeed); // Route for general feed (authenticated access only)
router.get("/login", authController.getLogin); // Route for login page
router.post("/login", authController.postLogin); // Route for handling login form submission
router.get("/logout", authController.logout); // Route for user logout
router.get("/signup", authController.getSignup); // Route for user signup page
router.post("/signup", authController.postSignup); // Route for handling signup form submission
router.post("/updateSkills", postsController.updateSkills); // Route for updating user skills
router.get("/favorites", ensureAuth, postsController.getFavorites); // Route for displaying user favorites

// Export the router for use in the main application
module.exports = router;
