/**
 * 
 * Houses constant values and enumerations used across the application.
 */

module.exports = {
    // Roles
    ROLES: {
      USER: 'user',
      ORGANIZER: 'organizer',
      ADMIN: 'admin',
    },
  
    // Response messages, default values, etc.
    MESSAGES: {
      UNAUTHORIZED: 'You are not authorized to access this resource.',
      FORBIDDEN: 'Forbidden: Insufficient privileges.',
      NOT_FOUND: 'Resource not found.',
    },
  
    // Default values
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
  };
  