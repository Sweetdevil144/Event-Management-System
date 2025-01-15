/**
 * 
 * Provides:
 * 1. `authenticate` middleware to verify JWT tokens.
 * 2. `authorizeRoles` middleware to check if the user has the required role(s).
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config');

/**
 * Authenticate the request by verifying the JWT token.
 * If valid, attaches `user` object to `req`.
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Extract token from headers (e.g., "Authorization: Bearer <token>")
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing or malformed' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user no longer exists' });
    }

    req.user = {
      userId: user._id,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

/**
 * Authorize roles (e.g. admin, organizer, user).
 * Usage:
 *   router.post('/admin-route', authenticate, authorizeRoles('admin'), adminControllerAction);
 */
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};
