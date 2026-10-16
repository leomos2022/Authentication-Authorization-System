const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Validation rules for registration
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email is not valid')
    .normalizeEmail(),
  body('username').notEmpty().withMessage('Username is required').trim(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
];

// GET /users/register
const getRegister = (req, res) => {
  res.render('register', { title: 'Register' });
};

// POST /users/register
const postRegister = async (req, res) => {
  const { name, email, username, password, confirmPassword } = req.body;

  // Determine profile image filename
  const profileImageName =
    req.files && req.files.length > 0 ? req.files[0].originalname : 'noImage.png';

  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('register', {
      errors: errors.array().map((e) => ({ msg: e.msg })),
      name,
      email,
      username,
      password,
      confirmPassword,
    });
  }

  try {
    // Check for duplicate username or email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const field = existingUser.username === username ? 'Username' : 'Email';
      return res.render('register', {
        errors: [{ msg: `${field} is already taken` }],
        name,
        email,
        username,
      });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      username,
      password: hash,
      profile: profileImageName,
    });

    await newUser.save();

    req.flash('success', 'You are now registered and may log in');
    res.redirect('/users/login');
  } catch (err) {
    console.error('Registration error:', err.message);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/users/register');
  }
};

// GET /users/login
const getLogin = (req, res) => {
  res.render('login', { title: 'Login' });
};

// GET /users/logout
const getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success', 'You have been logged out');
    res.redirect('/users/login');
  });
};

module.exports = { registerValidation, getRegister, postRegister, getLogin, getLogout };
