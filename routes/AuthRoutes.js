// Auth Routes

const express = require('express');
const AuthenticationController = require('../controllers/AuthController');
const AuthRoutes = new express.Router();

// Set auth routes as subgroup/middleware to apiRoutes
AuthRoutes.use('/auth', AuthRoutes);

// Registration route
AuthRoutes.post('/register', AuthenticationController.register);

// Login route
AuthRoutes.post('/login', AuthenticationController.login);

// Refresh route
AuthRoutes.get('/refresh', AuthenticationController.refreshToken);

module.exports = AuthRoutes;