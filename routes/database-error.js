const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('database-error', { layout: 'standard-layout' }));

module.exports = router;