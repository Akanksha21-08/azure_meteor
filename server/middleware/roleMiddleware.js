/**
 * roleMiddleware.js
 * Restricts route access to specific user roles.
 * Must be used after the `protect` middleware.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. This route requires role: [${roles.join(', ')}]. Your role: ${req.user.role}`
      });
    }
    next();
  };
};

module.exports = { authorize };
