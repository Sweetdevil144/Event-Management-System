/**
 * 
 * Notification endpoint:
 * - POST /notifications/send
 */

const router = require('express').Router();
const notificationController = require('../controllers/notification.controller');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');
const { ROLES } = require('../utils/constants');

// POST /notifications/send (organizer or admin can notify attendees)
router.post(
  '/send',
  authenticate,
  authorizeRoles(ROLES.ORGANIZER, ROLES.ADMIN),
  notificationController.sendNotification
);

module.exports = router;
