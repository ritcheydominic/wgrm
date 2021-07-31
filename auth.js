module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Log in to access that resource.');
        res.redirect('/users/log-in');
    }
}