const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFavorites: async (req, res) => {
    try {
      // Assuming you have user information in req.user after authentication
      const user = req.user;
  
      // Retrieve user's favorites from the database
      const userWithFavorites = await User.findById(user._id).populate('favorites');
  
      // Pass the userWithFavorites object to the template
      res.render("favorites.ejs", { user: userWithFavorites });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        favorites: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  createLaborerPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

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
      res.redirect("/laborer-profile");
    } catch (err) {
      console.log(err);
    }
  },
  createContractorPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

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
      res.redirect("/contractor-profile");
    } catch (err) {
      console.log(err);
    }
  },
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
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  getContractorProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("contractor-profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getLaborerProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("laborer-profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getContractorFeed: async (req, res) => {
    try {
      const posts = await Post.find({ postType: 'laborer' }).sort({ createdAt: "desc" }).lean();
      res.render("contractor-feed.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getLaborerFeed: async (req, res) => {
    try {
      const posts = await Post.find({ postType: 'contractor' }).sort({ createdAt: "desc" }).lean();
      res.render("laborer-feed.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  updateSkills: async (req, res) => {
    try {
      const newSkills = req.body.skills.split(',').map(skill => skill.trim()); // split the string into an array and remove whitespace
      const userId = req.user._id;
  
      const user = await User.findById(userId);
      if (!user) {
        console.log('User not found');
        return res.status(404).send();
      }
  
      user.skills = newSkills;
      await user.save();
  
      console.log("Updated Skills");
      res.redirect("/laborer-profile");
    } catch (err) {
      console.log(err);
    }
  },
};
