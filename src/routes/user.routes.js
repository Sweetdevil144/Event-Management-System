/**
 * 
 * User endpoints:
 * - GET /users/:id
 * - PUT /users/:id
 */

const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// GET /users/:id
router.get('/:id', authenticate, userController.getUserById);

// PUT /users/:id
router.put('/:id', authenticate, userController.updateUser);

module.exports = router;
