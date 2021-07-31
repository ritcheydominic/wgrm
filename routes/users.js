const express = require('express');
const router = express.Router();
const passport = require('passport')

router.get('/change-password', (req, res) => res.render('change-password', { layout: 'standard-layout' }));
router.get('/log-in', (req, res) => res.render('log-in', { layout: 'standard-layout' }));
router.get('/reset-password', (req, res) => res.render('reset-password', { layout: 'standard-layout' }));

// Handle login
router.post('/log-in', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/log-in',
        failureFlash: true
    })(req, res, next);
});

// Handle logout
router.get('/log-out', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Successfully logged out.');
    res.redirect('/users/log-in');
});

module.exports = router;