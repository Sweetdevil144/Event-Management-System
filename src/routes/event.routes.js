/**
 * 
 * Event endpoints:
 * - POST /events
 * - GET /events
 * - GET /events/:id
 * - PUT /events/:id
 * - DELETE /events/:id
 */

const router = require('express').Router();
const eventController = require('../controllers/event.controller');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');
const { ROLES } = require('../utils/constants');

// POST /events (organizer-only)
router.post('/', authenticate, authorizeRoles(ROLES.ORGANIZER), eventController.createEvent);

// GET /events (public: list all events)
router.get('/', eventController.getEvents);

// GET /events/:id (public: single event details)
router.get('/:id', eventController.getEventById);

// PUT /events/:id (organizer-only)
router.put('/:id', authenticate, authorizeRoles(ROLES.ORGANIZER), eventController.updateEvent);

// DELETE /events/:id (organizer-only)
router.delete('/:id', authenticate, authorizeRoles(ROLES.ORGANIZER), eventController.deleteEvent);

module.exports = router;
