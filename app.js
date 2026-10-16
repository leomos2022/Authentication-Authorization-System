require('dotenv').config();

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const flash = require('connect-flash');

const connectDB = require('./config/database');
const passport = require('./config/passport');

const routes = require('./routes/index');
const users = require('./routes/users');

// Connect to database
connectDB();

const app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// File uploads
app.use(multer({ dest: path.join(__dirname, 'uploads') }).any());

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// HTTP logger
app.use(logger('dev'));

// Body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  // Expose flash messages as locals for Bootstrap 5 Toasts
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  res.locals.flashInfo = req.flash('info');
  next();
});

// Expose authenticated user to all views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', routes);
app.use('/users', users);

// 404 handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
