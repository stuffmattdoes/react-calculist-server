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
        role: userData.role
    }
}

// Generate JSON web token (JWT) from user object we pass in
function generateToken (user, secret) {
    return jsonwebtoken.sign(
        {
            exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
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
    let formValidationResults = FormValidationUtils.formValidate(req.body);
    let validCreds = true;

    for (let val in formValidationResults) {
        if (typeof formValidationResults[val] === 'string') {
            validCreds = false;
        }
    }

    if (!validCreds) {
        res.status(422);

        let err = {
            errors: formValidationResults
        };
        return next(err);
    }

    // Now add our user
    User.findOne({ email: req.body.email.value }, (err, existingUser) => {
        if (err) {
            return next(err);
        }

        // Check for existing email
        if (existingUser) {
            console.log('User exists already.');
            res.status(422)
            let err = {
                errors: {
                    'email': 'That email address is already in use.'
                }
            };
            return next(err);
        }

        // If credentials are looking good, create the account!
        let user = new User({
            email: req.body.email.value,
            password: req.body.password.value
        });

        // Create our user
        user.save((err, user) => {
            if (err) {
                return next(err);
            }

            // Subscribe member to Mailchimp list
            // mailchimp.subscribeToNewsletter(user.email);

            // Respond with JWT if user was created
            let userInfo = setUserInfo(user);

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
    let email = req.body.email.value;
    let password = req.body.password.value;

    if (email && password) {
        User.authenticate(email, password, (error, user) => {
            if (error || !user) {
                res.status(401);

                let err = {
                    errors: {
                        'invalid': 'Wrong email or password.'
                    }
                };

                return next(err);
            } else {
                // Authorization token here
                // Respond with JWT if user was created
                let userInfo = setUserInfo(user);
                console.log(userInfo);
                return res.status(200).json({
                    jwt: generateToken(userInfo, config.secret),
                    user: userInfo
                });
            }
        });
    } else {
        res.status(401);

        let err = {
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
        req.session.destroy(err => {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/login');
            }
        });
    }
}


exports.refreshToken = (req, res, next) => {
    console.log('Refresh token');
    let token = req.headers['authorization'];

    // Check for token
    if (!token) {
        console.log('No token');
        res.status(401);

        let err = {
            message: 'You must provide a token.'
        }
        return next(err);
    }

    // Decode & verify token
    jsonwebtoken.verify(token, config.secret, (err, decoded) => {
        // if (decoded.exp < Date.now()) {
        //     console.log('true');
        // }

        if (err) {
            // console.log('Verify error:', err);
            return next(err);
        }

        if (decoded.exp < Date.now()) {
            // throw 401 status code & error message, return next(err);
            // console.log('Token expired');
            res.status(401);

            let err = {
                message: 'Your session has expired. Please log in again.'
            }

            return next(err);
        }

        //return user using the id from w/in JWTToken
        User.findById({'_id': decoded.user._id}, (err, user) => {
            if (err) {
                // console.log('user error:', err);
                return next(err);
            }

            return res.status(200).send();
        });
    });
}

// ==================================================
// Authorization Middleware
// ==================================================

exports.authUser = (req, res, next) => {
    // console.log('auth user');

    let token = req.headers['authorization'];
    let decoded = jsonwebtoken.decode(token, config.secret);

    // 1. Validate the token
    if (decoded.exp < Date.now()) {
        // throw 401 status code & error message, return next(err);
        res.status(401);

        let err = {
            message: 'Your session has expired. Please log in again.'
        }

        return next(err);
    }

    // 2. Authenticate the user

    // 3. Authorize the user's role

    req._user = decoded.user;

    return next();
}

// Role authorization check
exports.authRole = (req, res, next) => {

}

