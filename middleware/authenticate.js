/**
 * Middleware to protect routes that require authentication.
 * Redirects unauthenticated requests to the login page.
 */
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You must be logged in to view that page.');
  res.redirect('/users/login');
};

module.exports = { ensureAuthenticated };
