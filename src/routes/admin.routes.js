/**
 * 
 * Admin-only routes:
 * - GET /admin/users
 * - DELETE /admin/users/:id
 * - GET /admin/events
 */

const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');
const { ROLES } = require('../utils/constants');

// GET /admin/users
router.get('/users', authenticate, authorizeRoles(ROLES.ADMIN), adminController.getAllUsers);

// DELETE /admin/users/:id
router.delete('/users/:id', authenticate, authorizeRoles(ROLES.ADMIN), adminController.deleteUser);

// GET /admin/events
router.get('/events', authenticate, authorizeRoles(ROLES.ADMIN), adminController.getAllEventsWithStats);

module.exports = router;
