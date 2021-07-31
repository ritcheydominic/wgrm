const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoDbConfig = require('./config').mongodb;
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Passport config
require('./passport')(passport);

// Body parser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Initialize EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use(express.static('static'))

// Check database connectivity
mongoose.connect(mongoDbConfig.shortUrl, {useNewUrlParser: true})
.then(() => {
    app.use('/', require('./routes/index'));
    app.use('/setup', require('./routes/setup'));
    app.use('/users', require('./routes/users'));
    app.use('/dashboard', require('./routes/dashboard'));
}).catch(err => {
    console.error('[DB] Connection error:\n' + err);
    app.use('/', require('./routes/database-error'));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`[App] Server started on port ${PORT}`));