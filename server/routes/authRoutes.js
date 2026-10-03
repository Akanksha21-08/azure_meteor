const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  refreshTokenHandler,
  logoutUser,
  getMe,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  registerSchema,
  loginSchema,
  changePasswordSchema
} = require('../validators/authValidator');

// Public auth routes with rate limiting and Zod validation
router.post('/register', authLimiter, validate(registerSchema), registerUser);
router.post('/login', authLimiter, validate(loginSchema), loginUser);
router.post('/refresh', authLimiter, refreshTokenHandler);
router.post('/logout', logoutUser);

// Protected user routes
router.get('/me', protect, getMe);
router.put('/change-password', protect, validate(changePasswordSchema), changePassword);

module.exports = router;
