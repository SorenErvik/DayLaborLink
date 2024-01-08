const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

// Configure Passport with local strategy for authentication
module.exports = function (passport) {
  // Define a Local Strategy for authenticating users with their email and password
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Find a user by their email in the database
      User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
          return done(err);
        }
        // Handle the case where the user is not found
        if (!user) {
          return done(null, false, { msg: `Email ${email} not found.` });
        }
        // Handle the case where the user registered with a sign-in provider and doesn't have a password
        if (!user.password) {
          return done(null, false, {
            msg:
              "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
          });
        }
        // Compare the provided password with the stored hashed password
        user.comparePassword(password, (err, isMatch) => {
          if (err) {
            return done(err);
            // If the password matches, authenticate the user
          }
          if (isMatch) {
            return done(null, user);
          }
          // If the password is incorrect, deny authentication
          return done(null, false, { msg: "Invalid email or password." });
        });
      });
    })
  );

  // Serialize the user for session storage
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize the user from session storage
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
