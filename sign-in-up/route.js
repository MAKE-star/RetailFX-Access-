const signService = require('./service');
const express = require('express');
const router = express.Router();
const authenticate = require("../middleware/authentication");


// app.post('/signup', signService.signup);
router.post('/login', signService.login);
router.post('/forgot-password',authenticate() ,signService.forgotPassword);
router.post('/reset-password', authenticate(), signService.resetPassword);



module.exports = router;