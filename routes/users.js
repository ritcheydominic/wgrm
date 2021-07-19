const express = require('express');
const router = express.Router();

router.get('/create-first-user', (req, res) => res.render('create-first-user'));
router.get('/change-password', (req, res) => res.render('change-password'));
router.get('/reset-password', (req, res) => res.render('reset-password'))

module.exports = router;