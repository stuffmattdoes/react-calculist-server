// List Routes

const express = require('express');
const AuthenticationController = require('../controllers/AuthController');
const ListController = require('../controllers/ListsController');
const ListRoutes = new express.Router();

ListRoutes.use('/lists', ListRoutes);

// Get all lists
// /lists
ListRoutes.get('/', AuthenticationController.authUser, ListController.getLists);

// Create a new list
// /lists/asdvm3t
ListRoutes.post('/:listID', AuthenticationController.authUser, ListController.createList);

// Update existing list
// /lists/asdvm3t
ListRoutes.put('/:listID', AuthenticationController.authUser, ListController.updateList);

// Remove existing list
// /lists/asdvm3t
ListRoutes.delete('/:listID', AuthenticationController.authUser, ListController.deleteList);

module.exports = ListRoutes;