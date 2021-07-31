const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Find user in database
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Incorrect email address or password.' });
                    }

                    // Check if user is enabled
                    if (!user.active) {
                        return done(null, false, { message: 'Account is disabled or unavailable.' });
                    }

                    // Check if password is correct
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {

                        } else if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Incorrect email address or password.' });
                        }
                    })
                })
                .catch(err => {

                });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}