/**
 * 
 * Central place for other global configurations (e.g., CORS options, 
 * rate limiting, or environment checks).
 */

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
  };
  