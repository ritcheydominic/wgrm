const express = require('express');
const router = express.Router();

router.get('/create-first-user', (req, res) => res.render('create-first-user', { layout: 'standard-layout' }));
router.get('/change-password', (req, res) => res.render('change-password', { layout: 'standard-layout' }));
router.get('/reset-password', (req, res) => res.render('reset-password', { layout: 'standard-layout' }));

module.exports = router;