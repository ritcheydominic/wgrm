const express = require('express');
const router = express.Router();

router.get('/change-password', (req, res) => res.render('change-password', { layout: 'standard-layout' }));
router.get('/log-in', (req, res) => res.render('log-in', { layout: 'standard-layout' }));
router.get('/reset-password', (req, res) => res.render('reset-password', { layout: 'standard-layout' }));

module.exports = router;