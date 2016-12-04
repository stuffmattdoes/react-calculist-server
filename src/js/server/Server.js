var express = require('express');
var session = require('express-session');
var parser = require('body-parser');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);     // Passing session as a parameter here allows mongo connect store access to it
var path = require('path');
var app = express();
var router = require('./api/Router');

// Establish database connection
mongoose.connect('mongodb://localhost/calculist', (res) => {
    if (res) {
        console.log("Failure to run Mongoose.", res);
    } else {
        console.log("Mongoose is running!");
    }
});

var db = mongoose.connection;

// User sessions for tracking user logins
app.use(session({
	resave: true,				// Forces session to be saved in session store whether anything changed during request or not
	saveUninitialized: true, 	// Forces uninitialized session (new, not yet modified session) to be saved in session store
	secret: 'noodles',			// Required. Signs session ID cookie, adds another level of security
	store: new MongoStore({		// Stores session IDs in a database instead of the server. Frees up server memory for many concurrent users
		mongooseConnection: db
	})
}));

// Seed data
require('./Seed');

// Serve static files like CSS, HTML & JS
app.use('/', express.static('public'));

// Parse incoming requests
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

// Mount router to app
// Prefix routes with API namespace
app.use('/api', router);

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Route catch all
// Allows static files to be served from URLs other than from '/'
app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../../../public', 'index.html'))
});

// serve static files from /public
// app.use(express.static(__dirname + '/public'));

// Run local server
app.listen(8081, function() {
    console.log("The server is running on port: 8081");
});
