const rateLimit = require('express-rate-limit');

// Rate limiting for authentication routes (login, register, refresh)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per IP per window
  message: { 
    message: 'Too many authentication attempts from this IP address, please try again after 15 minutes.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { 
    message: 'Too many requests, please slow down.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };
