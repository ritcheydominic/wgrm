const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Group = require('../models/Group');
const mongoDbConfig = require('../config').mongodb;
const mongoose = require('mongoose');

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
    } else { // Add first user and super admin group to database
        mongoose.connect(mongoDbConfig.shortUrl, {useNewUrlParser: true})
            .then(() => {
                mongoose.connection.db.collection('users').countDocuments(function(err, count) { // Check to make sure users collection is empty
                    if (err) {
                        console.error('[DB] Read error:\n' + err);
                        errors.push({ msg: 'Database error occurred. View console for details.' });
                        res.render('create-first-user', {
                            layout: 'standard-layout',
                            errors,
                            email,
                            name
                        });
                    } else {
                        if (count > 0) {
                            res.redirect('/users/log-in');
                        } else {
                            Group.findOne({ name: 'Super Admin' }) // Check to make sure that super admin group doesn't already exist
                                .then(group => {
                                    if (group) {
                                        res.redirect('/users/log-in');
                                    } else {
                                        const superAdminGroup = new Group({
                                            name: 'Super Admin',
                                            permissions: ['super-admin']
                                        });
                                        superAdminGroup.save() // Save super admin group to database
                                            .then(group => {
                                                const newUser = new User({ email, name, password, groups: [superAdminGroup._id] });
                    
                                                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => { // Hash password
                                                    if (err) {
                                                        console.error('[Auth] Hash generation error:\n' + err);
                                                        errors.push({ msg: 'Internal error occurred. View console for details.' });
                                                        res.render('create-first-user', {
                                                            layout: 'standard-layout',
                                                            errors,
                                                            email,
                                                            name
                                                        });
                                                    } else {
                                                        newUser.password = hash;
                                                        newUser.save() // Save first user to database with hashed password
                                                            .then(user => {
                                                                res.redirect('/users/log-in');
                                                            })
                                                            .catch(err => {
                                                                console.error('[DB] Write error:\n' + err);
                                                                errors.push({ msg: 'Database error occurred. View console for details.' });
                                                                res.render('create-first-user', {
                                                                    layout: 'standard-layout',
                                                                    errors,
                                                                    email,
                                                                    name
                                                                });
                                                            });
                                                    }
                                                }));
                                            })
                                            .catch(err => {
                                                console.error('[DB] Write error:\n' + err);
                                                errors.push({ msg: 'Database error occurred. View console for details.' });
                                                res.render('create-first-user', {
                                                    layout: 'standard-layout',
                                                    errors,
                                                    email,
                                                    name
                                                });
                                            });
                                    }
                                })
                                .catch(err => {
                                    console.error('[DB] Read error:\n' + err);
                                    errors.push({ msg: 'Database error occurred. View console for details.' });
                                    res.render('create-first-user', {
                                        layout: 'standard-layout',
                                        errors,
                                        email,
                                        name
                                    });
                                });
                        }
                    }
            });
            }).catch(err => {
                console.error('[DB] Connection error:\n' + err);
                errors.push({ msg: 'Database error occurred. View console for details.' });
                res.render('create-first-user', {
                    layout: 'standard-layout',
                    errors,
                    email,
                    name
                });
            });
    }
});

module.exports = router;