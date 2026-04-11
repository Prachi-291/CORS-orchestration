const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// User login endpoint
router.post('/login', authController.loginUser);
// User registration endpoint
router.post('/register', authController.registerUser);
// Verify organization invite token
router.get('/invite/verify/:token', authController.verifyInviteToken);

module.exports = router;
