const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

// Controller for handling user authentication and authorization
// using Passport.js local strategy

// Display login page
exports.getLogin = (req, res) => {
  // Redirect authenticated users to their profile based on userType
  if (req.user) {
  if (req.user.userType === "contractor") {
    return res.redirect("../contractor-profile");
  } else if (req.user.userType === "laborer") {
    return res.redirect("../laborer-profile");
  } else {
    return res.redirect("/profile");
  }
  }
  // Render login page for non-authenticated users
  res.render("login", {
    title: "Login",
  });
};

// Handle user login form submission
exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  // Validate email and password
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

    // If there are validation errors, redirect back to login page with error messages
  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  // Normalize email address
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  // Authenticate user using Passport local strategy
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    // If user authentication fails, redirect back to login page with error messages
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    // If user authentication succeeds, log in the user and redirect to their profile based on userType
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });

      if (req.user.userType === "contractor") {
         res.redirect(req.session.returnTo || "../contractor-profile");
      } else if (req.user.userType === "laborer") {
         res.redirect(req.session.returnTo || "../laborer-profile");
      } else {
        res.redirect(req.session.returnTo || "/profile");
      }
    });
  })(req, res, next);
};

// Log out the user and destroy the session
exports.logout = (req, res) => {
  req.logout(() => {
    console.log('User has logged out.')
  })
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};

// Display signup page
exports.getSignup = (req, res) => {
  // Redirect authenticated users to their profile
  if (req.user) {
    return res.redirect("/profile");
  }
  // Render signup page for non-authenticated users
  res.render("signup", {
    title: "Create Account",
  });
};

// Handle user signup form submission
exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  // Validate email, password, and confirmPassword
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  // If there are validation errors, redirect back to signup page with error messages
  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  // Normalize email address
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  // Create a new user and save to the database
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    userType: req.body.userType,
  });

  // Check if the email or username already exists in the database
  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName },] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      // If user already exists, redirect back to signup page with error message
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      }
      // Save the new user to the database
      user.save((err) => {
        if (err) {
          return next(err);
        }
        // Log in the new user and redirect to their profile based on userType
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          } else if (user.userType === "contractor") {
            res.redirect("../contractor-profile");
          } else if (user.userType === "laborer") {
            res.redirect("../laborer-profile");
          }
        });
      });
    }
  );
};
