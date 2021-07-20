const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/create-first-user', (req, res) => res.render('create-first-user', { layout: 'standard-layout' }));

// Handle first user creation
router.post('/create-first-user', (req, res) => {
    const { email, name, password, verifyPassword } = req.body;

    let errors = [];

    // Check for required fields
    if (!email || !name || !password || !verifyPassword) {
        errors.push({ msg: 'Please fill in all fields.' });
    }

    // Check that passwords match
    if (password !== verifyPassword) {
        errors.push({ msg: 'Passwords must match.' });
    }

    // Check that password is at least 8 characters
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters.' });
    }

    if (errors.length > 0) { // Cancel action due to failed validation
        res.render('create-first-user', {
            layout: 'standard-layout',
            errors,
            email,
            name
        });
    } else { // Process user creation
        User.findOne({ email: email })
            .then(user => {
                if (user) { // Cancel action due to user already existing
                    errors.push({ msg: 'Email address is already in use.' })
                    res.render('create-first-user', {
                        layout: 'standard-layout',
                        errors,
                        email,
                        name
                    });
                } else { // Process user creation
                    const newUser = new User({ email, name, password });
                    
                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash; // Save hashed password
                        newUser.save() // Save user in database
                            .then(user => {
                                res.redirect('/users/log-in');
                            })
                            .catch(err => console.err(err));
                    }));
                }
            });
    }
});

module.exports = router;