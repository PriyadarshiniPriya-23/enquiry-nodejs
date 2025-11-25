// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, createUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { permitForRoute } = require('../middleware/rolePermission');

// login open
router.post('/login', login);

// create_user protected: allow only admin (apply middleware)
router.post('/create_user', authenticateToken, permitForRoute({ requiredRoles: ['admin'] }), createUser);

module.exports = router;
