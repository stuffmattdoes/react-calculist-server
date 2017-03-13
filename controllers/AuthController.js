// Libraries
const config = require('../Config');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');

// Utilities
const FormValidationUtils = require('../utils/FormValidationUtils');

function setUserInfo(userData) {
    return {
        _id: userData._id,
        email: userData.email,
        profile: userData.profile
    }
}

// Generate JSON web token (JWT) from user object we pass in
function generateToken (user, secret) {
    return jsonwebtoken.sign(
        {
            expiresIn: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
            // exp: Date.now() + 2000, // 2 seconds
            // exp: 60,
            user: user
        },
        secret
    );
}


// ==================================================
// Registration Route
// ==================================================

// POST route - user registration
exports.register = (req, res, next) => {
    req.body.email.value = req.body.email.value.toLowerCase();
    var formValidationResults = FormValidationUtils.formValidate(req.body);
    var validCreds = true;

    for (var val in formValidationResults) {
        if (typeof formValidationResults[val] === 'string') {
            validCreds = false;
        }
    }

    if (!validCreds) {
        res.status(422);

        var err = {
            errors: formValidationResults
        };
        return next(err);
    }

    // Now add our user
    User.findOne({ email: req.body.email.value }, function(err, existingUser) {
        if (err) {
            return next(err);
        }

        // Check for existing email
        if (existingUser) {
            res.status(422)
            var err = {
                errors: {
                    'email': 'That email address is already in use.'
                }
            };
            return next(err);
        }

        // If credentials are looking good, create the account!
        var user = new User({
            email: req.body.email.value,
            password: req.body.password.value
        });

        // Create our user
        user.save(function(err, user) {
            if (err) {
                return next(err);
            }

            // Subscribe member to Mailchimp list
            // mailchimp.subscribeToNewsletter(user.email);

            // Respond with JWT if user was created
            var userInfo = setUserInfo(user);

            return res.status(201).json({
                jwt: generateToken(userInfo, config.secret),
                user: userInfo
            });
        });

    });
}

// ==================================================
// Login Route
// ==================================================

// POST route - user login
exports.login = (req, res, next) => {
    var email = req.body.email.value;
    var password = req.body.password.value;

    if (email && password) {
        User.authenticate(email, password, function(error, user) {
            if (error || !user) {
                res.status(401);

                var err = {
                    errors: {
                        'invalid': 'Wrong email or password.'
                    }
                };

                return next(err);
            } else {
                // Authorization token here
                // Respond with JWT if user was created
                var userInfo = setUserInfo(user);
                return res.status(200).json({
                    jwt: generateToken(userInfo, config.secret),
                    user: userInfo
                });
            }
        });
    } else {
        res.status(401);

        var err = {
            errors: {
                'invalid': 'Wrong email or password.'
            }
        };

        return next(err);
    }
}

// GET route - user log out
exports.logout = (req, res, next) => {
    if (req.session) {

        // Delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/login/');
            }
        });
    }
}


exports.refreshToken = (req, res, next) => {
    var token = req.headers['authorization'];

    // Check for token
    if (!token) {
        res.status(401);

        var err = {
            message: 'You must provide a token.'
        }
        return next(err);
    }

    // Decode & verify token
    jsonwebtoken.verify(token, config.secret, function(err, decoded) {

        if (err) {
            console.log('Error 1');
            return next(err);
        }

        if (decoded.expiresIn < Date.now()) {
            console.log('Error 2');
            // throw 401 status code & error message, return next(err);
            res.status(401);

            var err = {
                message: 'Your session has expired. Please log in again.'
            }

            return next(err);
        }

        //return user using the id from w/in JWTToken
        User.findById({'_id': decoded.user._id}, function(err, user) {
            if (err) {
                console.log('Error 3');
                return next(err);
            }

            var userInfo = setUserInfo(user);
            return res.status(200).json({
                user: userInfo
            });
        });
    });
}

// ==================================================
// Authorization Middleware
// ==================================================

exports.authUser = (req, res, next) => {
    var token = req.headers['authorization'];
    var decoded = jsonwebtoken.decode(token, config.secret);

    // 1. Validate the token
    if (decoded.expiresIn < Date.now()) {
        // throw 401 status code & error message, return next(err);
        res.status(401);

        var err = {
            message: 'Your session has expired. Please log in again.'
        }

        return next(err);
    }

    // 2. Authenticate the user
    // 3. Authorize the user's role
    req._user = decoded.user;

    return next();
}

