// Middleware to ensure user is authenticated
module.exports = {
  ensureAuth: function (req, res, next) {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
      // If authenticated, proceed to the next middleware or route handler
      return next();
    } else {
      // If not authenticated, redirect to the home page
      res.redirect("/");
    }
  },

  // Middleware to ensure guest (unauthenticated user)
  ensureGuest: function (req, res, next) {
    // Check if the user is not authenticated (guest)
    if (!req.isAuthenticated()) {
      // If guest, proceed to the next middleware or route handler
      return next();
    } else {
      // If authenticated, redirect to the dashboard
      res.redirect("/dashboard");
    }
  },
};
