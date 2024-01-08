const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); // Import multer middleware for handling file uploads
const postsController = require("../controllers/posts"); // Import posts controller
const { ensureAuth, ensureGuest } = require("../middleware/auth"); // Import authentication middleware

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost); // Route for viewing a specific post (authenticated access only)

router.post("/createPost", upload.single("file"), postsController.createPost); // Route for creating a post (authenticated access only, with file upload)

router.post("/createLaborerPost", upload.single("file"), postsController.createLaborerPost); // Route for creating a laborer post (authenticated access only, with file upload)

router.post("/createContractorPost", upload.single("file"), postsController.createContractorPost); // Route for creating a contractor post (authenticated access only, with file upload)

router.put("/favoritePost/:id", postsController.favoritePost); // Route for favoriting a post (authenticated access only)

router.delete("/deletePost/:id", postsController.deletePost); // Route for deleting a post (authenticated access only)

// Export the router for use in the main application
module.exports = router;
