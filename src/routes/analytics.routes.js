/**
 * 
 * Analytics endpoints:
 * - GET /analytics/events/popular
 * - GET /analytics/users/active
 * - GET /analytics/events/:id/stats
 */

const router = require('express').Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');
const { ROLES } = require('../utils/constants');

// GET /analytics/events/popular
router.get(
  '/events/popular',
  authenticate,
  authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER),
  analyticsController.getPopularEvents
);

// GET /analytics/users/active
router.get(
  '/users/active',
  authenticate,
  authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER),
  analyticsController.getActiveUsers
);

// GET /analytics/events/:id/stats
router.get(
  '/events/:id/stats',
  authenticate,
  authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER),
  analyticsController.getEventStats
);

module.exports = router;
