const express = require('express');
const router = express.Router();
const { generatePassword, getPasswordHistory } = require('../controllers/passwordController');

router.post('/generate-password', generatePassword);
router.get('/password-history', getPasswordHistory);

module.exports = router;
