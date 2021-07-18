const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => res.send('Login'));
router.get('/change-password', (req, res) => res.send('Change password'));

module.exports = router;