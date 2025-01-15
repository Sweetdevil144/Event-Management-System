/**
 * 
 * Auth endpoints:
 * - POST /auth/register
 * - POST /auth/login
 */

const router = require('express').Router();
const authController = require('../controllers/auth.controller');

// POST /auth/register
router.post('/register', authController.register);

// POST /auth/login
router.post('/login', authController.login);

module.exports = router;
