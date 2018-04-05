var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var otpService = require('../controllers/otpservice');

// open Url
router.get('/', (req, res) => {
    res.send('SERVER IS WORKING');
});
router.get('/test', (req, res) => {
    const testUser = req.query.email;
    res.send('Testing successfull for -> ', testUser);
});

// mail OTP
router.post('/mailOtp', otpService.mailotp);
router.post('/deleteOtp', otpService.deleteOtpOfUserEmail);

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// developer APIs
router.post('/createNewUserByEmail', ctrlProfile.createNewUserByEmail);
router.get('/findAllUsers', ctrlProfile.findAllUsers);
router.post('/deleteUserByEmail', ctrlProfile.deleteUserByEmail);

module.exports = router;