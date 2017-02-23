'use strict';

// Modules
const config = require('./Config');
const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const path = require('path');
const app = express();

// Routes
const AuthRoutes = require('./routes/AuthRoutes');
const ItemRoutes = require('./routes/ItemsRoutes');
const ListRoutes = require('./routes/ListsRoutes');

// Variables
// const ROOT_DIR = process.env.ROOT_DIR = __dirname;

// Assign Mongoose promise to native Node promise
mongoose.Promise = Promise;

// Establish database connection
mongoose.connect(config.database);

// Parse url encoded responses into useable formats
// In this case, we'll parse into JSON
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

// serve static files from /public
// app.use(express.static(__dirname + './public'));

// Enable CORS from client-side
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Controll-Allow-Credentials');
    next();
});

// Serve static files like CSS, HTML & JS
app.use('/', express.static('public'));
app.use('/lists', express.static('public'));
app.use('/lists/*', express.static('public'));
app.use('/lists/*/settings', express.static('public'));
app.use('/login', express.static('public'));
app.use('/register', express.static('public'));

// Give our App access to our routes
// Set URL for API group routes
// domain.com/api/ 
// app.use('/api', APIRoutes);
app.use('/api', AuthRoutes);
app.use('/api', ItemRoutes);
app.use('/api', ListRoutes);

// Route catch all
// Allows static files to be served from URLs other than from '/'
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
// });

// 404 missing resource
app.all( '*' , ( req, res, next ) => {
    res.status( 404 );

    // DEPENDING ON API OR VIEW, RENDER 404 OR SEND 404

    // res.render( '404' );

    res.send({
        'status': res.statusCode,
        'message': 'No resource exists at this route.'
    });

});

// Configure Error Handling
app.use(( err, req, res, next ) => {
    let _errorStatus = err.status || 500;

    if ( res.statusCode == 200 ) {
        res.status( _errorStatus );
    }

    // let status = res.statusCode;
    // let message = err.message || 'no message';
    // let errors = err.errors || 'no errors';
    // let stack = err.stack || 'no stack';
    // let raw = err._raw || 'no raw';

    // logger.log( 'error' , { 'status': status , 'message': message , 'stack': stack , 'raw': raw } );

    console.log('Error1:', err);
    next( err );
});

app.use(( err, req, res, next ) => {
    let responseError = {
        'status': res.statusCode,
        'message': err.message,
        'errors' : err.errors
    };
    console.log('Error2:', responseError);
    res.send(responseError);
    if ( err.stack ) { console.log( err.stack ); }
});

// Start the server
const server = app.listen(config.port, () => {
    console.log("The server is running on port: " + config.port);
});