// Controller for handling post-related actions


const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  // Get user's profile and their posts
  getProfile: async (req, res) => {
    try {
      // Fetch posts associated with the user
      const posts = await Post.find({ user: req.user.id });
      // Render the profile page with user's posts
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  // Get global feed of all posts
  getFeed: async (req, res) => {
    try {
      // Fetch all posts, sorted by creation date in descending order
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      // Render the feed page with all posts
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },

  // Get details of a specific post
  getPost: async (req, res) => {
    try {
      // Fetch the post by ID
      const post = await Post.findById(req.params.id);
      // Fetch the post by ID
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  // Get user's favorite posts
  getFavorites: async (req, res) => {
    try {
      // Assuming you have user information in req.user after authentication
      const user = req.user;
  
      // Retrieve user's favorites from the database
      const userWithFavorites = await User.findById(user._id).populate('favorites');
  
      // Render the favorites page with user's favorite posts
      res.render("favorites.ejs", { user: userWithFavorites });
    } catch (err) {
      console.log(err);
    }
  },

  // Create a new post
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Create a new post with uploaded image and other details
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        favorites: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      // Redirect to user's profile after creating the post
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },

  // Create a laborer post
  createLaborerPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Create a new post with uploaded image and other details
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        favorites: 0,
        user: req.user.id,
        postType: 'laborer',
      });
      console.log("Post has been added!");
      // Redirect to user's profile after creating the post
      res.redirect("/laborer-profile");
    } catch (err) {
      console.log(err);
    }
  },

  // Create a contractor post
  createContractorPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Create a new post with uploaded image and other details
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        favorites: 0,
        user: req.user.id,
        postType: 'contractor',
      });
      console.log("Post has been added!");
      // Redirect to user's profile after creating the post
      res.redirect("/contractor-profile");
    } catch (err) {
      console.log(err);
    }
  },

  // Update the favorites count for a post and the user's favorites array
  favoritePost: async (req, res) => {
    try {
    // Update the favorites count in the Post document
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { favorites: 1 } },
      { new: true } // Return the updated post
    );

    // Find the current user and update their favorites array
    const user = await User.findOneAndUpdate(
      { _id: req.user.id }, // Assuming you have user information in req.user after authentication
      { $push: { favorites: updatedPost._id } },
      { new: true } // Return the updated user
    );
      console.log("Favorites +1");
      // Redirect to the post details page after favoriting
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

  // Delete a post
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      // Redirect to user's profile after deleting the post
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },

  // Get contractors profile and their posts
  getContractorProfile: async (req, res) => {
    try {
      // Get all posts associated with the user
      const posts = await Post.find({ user: req.user.id });
      // Render the profile page with user's posts
      res.render("contractor-profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  // Get laborers profile and their posts
  getLaborerProfile: async (req, res) => {
    try {
      // Get all posts associated with the user
      const posts = await Post.find({ user: req.user.id });
      // Render the profile page with user's posts
      res.render("laborer-profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  // Get the feed that contractors will see
  getContractorFeed: async (req, res) => {
    try {
      // Get all posts created by laborers
      const posts = await Post.find({ postType: 'laborer' }).sort({ createdAt: "desc" }).lean();
      // Render the feed with laborer's posts
      res.render("contractor-feed.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  // Get the feed that laborers will see
  getLaborerFeed: async (req, res) => {
    try {
      // Get all posts created by contractors
      const posts = await Post.find({ postType: 'contractor' }).sort({ createdAt: "desc" }).lean();
      // Render the feed with contractor's posts
      res.render("laborer-feed.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  // Update user skills based on the input provided
  updateSkills: async (req, res) => {
    try {
      // Get the new skills from the request body and sanitize them
      const newSkills = req.body.skills.split(',').map(skill => skill.trim()); // split the string into an array and remove whitespace
      // Get the user ID from the authenticated user's session
      const userId = req.user._id;
      
      // Find the user in the database based on the user ID
      const user = await User.findById(userId);
      // Check if the user exists
      if (!user) {
        console.log('User not found');
        // If user not found, return a 404 status
        return res.status(404).send();
      }
      
      // Update the user's skills with the new skills
      user.skills = newSkills;

      // Save the updated user profile
      await user.save();
  
      console.log("Updated Skills");
      // Redirect to the laborer profile to view the updated skills
      res.redirect("/laborer-profile");
    } catch (err) {
      console.log(err);
    }
  },
};
