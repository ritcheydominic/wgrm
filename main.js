const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoDbConfig = require('./config').mongodb;
const mongoose = require('mongoose');

const app = express();

// Initialize EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use(express.static('static'))

// Body parser
app.use(express.urlencoded({ extended: false }));

// Check database connectivity
mongoose.connect(mongoDbConfig.shortUrl, {useNewUrlParser: true})
.then(() => {
    app.use('/', require('./routes/index'));
    app.use('/setup', require('./routes/setup'));
    app.use('/users', require('./routes/users'));
}).catch(err => {
    console.error('[DB] Connection error:\n' + err);
    app.use('/', require('./routes/database-error'));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`[App] Server started on port ${PORT}`));