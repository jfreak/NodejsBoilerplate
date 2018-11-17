const User = require('../models/user');
const crypto = require('crypto');
const { promisify } = require('util');
const passport = require('passport');

const randomBytesAsync = promisify(crypto.randomBytes);

exports.postLogin = (req, res, next) => {
    req.body.email = 'jagpreetschawla@gmail.com';
    req.body.password = 'jagpreet';
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    // req.assert('confirmPassword', 'Passwords do not match').equals(req.body.passportssword);
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        console.log(errors);
        return res.redirect('/signup');
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            console.log(existingUser);
            req.flash('errors', { msg: 'Account with that email address already exists.' });
            return res.redirect('/signup');
        }
        user.save((err) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
                console.log(user);
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
};
