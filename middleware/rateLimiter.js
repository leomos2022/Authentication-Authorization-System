const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for the login route.
 * Prevents brute-force attacks by limiting requests from a single IP.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 login attempts per window per IP
  message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter };
