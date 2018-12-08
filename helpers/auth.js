/* Any1 should not see the ideas of anybody else so that, ensureAuthenticated,(req, res)
   at every stage */
// If user trying to go to any page via URL this will be protected by this method/function

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Not Authorized!");
    res.redirect("/users/login");
  }
};
