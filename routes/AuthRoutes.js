// Auth Routes

const express = require('express');
const AuthenticationController = require('../controllers/AuthController');
const AuthRoutes = new express.Router();

// Set auth routes as subgroup/middleware to apiRoutes
AuthRoutes.use('/auth', AuthRoutes);

// Registration route
AuthRoutes.post('/register', (req, res, next) => {
    AuthenticationController.register(req, res, next);
});

// Login route
AuthRoutes.post('/login', (req, res, next) => {
    AuthenticationController.login(req, res, next);
});

// Refresh route
AuthRoutes.get('/refresh', (req, res, next) => {
    AuthenticationController.refreshToken(req, res, next);
});

module.exports = AuthRoutes;