const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('log-in', { layout: 'standard-layout' }));

module.exports = router;