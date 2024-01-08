// Controller for handling home-related actions

// Display the index page
module.exports = {
  getIndex: (req, res) => {
    // Render the index page (home page)
    res.render("index.ejs");
  },
};
