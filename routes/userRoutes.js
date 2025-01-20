const express = require('express');
const router = express.Router();

const {
  loginUser,
  logout,
  registerUser,
  forgotpass,
  verifyOtpForgot,
  resetPassword,
} = require('../Controllers/userControllers');

router.post('/create', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotpass);
router.post('/verifyOtpForgot', verifyOtpForgot);
router.post('/reset-password', resetPassword);

module.exports = router;
