const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  registerValidation,
  getRegister,
  postRegister,
  getLogin,
  getLogout,
} = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');

// Registration
router.get('/register', getRegister);
router.post('/register', registerValidation, postRegister);

// Login — rate limited
router.get('/login', getLogin);
router.post(
  '/login',
  loginLimiter,
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Invalid username or password',
  }),
  (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/');
  }
);

// Logout
router.get('/logout', getLogout);

module.exports = router;
