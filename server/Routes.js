const 	AuthenticationController = require('./controllers/AuthController'),
		express = require('express'),
		ItemController = require('./controllers/ItemsController'),
		ListController = require('./controllers/ListsController'),
		passPortService = require('./Passport'),
		passport = require('passport');

const requireAuth = passport.authenticate('jwt', {
	session: false
});

const requireLogin = passport.authenticate('local', {
	session: false
});

const Routes = app => {
	console.log("Routes are working");
	const 	apiRoutes = express.Router(),
			API_VERSION = 'v1.0',
			authRoutes = express.Router(),
			listRoutes = express.Router(),
			itemRoutes = express.Router();

	// Set URL for API group routes
	// domain.com/api/ 
	app.use('/api/', apiRoutes);

	// ==================================================
	// Auth Route
	// ==================================================

	// Set auth routes as subgroup/middleware to apiRoutes
	apiRoutes.use('/auth', authRoutes);

	// Registration route
	authRoutes.post('/register', AuthenticationController.register);

	// Login route
	authRoutes.post('/login', requireLogin, AuthenticationController.login);
	

	// ==================================================
	// Lists Route
	// ==================================================

	apiRoutes.use('/lists', listRoutes);
		
	// Get all lists
	listRoutes.get('/', ListController.getLists);

	// Create a new list
	// listRoutes.post('/lists', requireAuth, ListController.createList);
	listRoutes.post('/lists', ListController.createList);

	// Update existing list
	listRoutes.put('/lists/:id', ListController.updateList);

	// Remove existing list
	listRoutes.delete('/lists/:id', ListController.deleteList);


	// ==================================================
	// Items Route
	// ==================================================

	apiRoutes.use('/lists', itemRoutes);

	// Get all items for this list
	itemRoutes.get('/:id', ItemController.getItemsForList);

	// Create a new item
	itemRoutes.post('/:id', ItemController.createItem);

	// Update an existing item
	itemRoutes.put('/:id', ItemController.updateItem);

	// Delete an existing item
	itemRoutes.delete('/:id', ItemController.deleteItem);

}

module.exports = Routes;