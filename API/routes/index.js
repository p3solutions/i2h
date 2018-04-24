var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAddress = require('../controllers/address');
var ctrlDependent = require('../controllers/dependent');
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
router.get('/mailOtp/:email', otpService.mailOtp);
router.post('/deleteOtp', otpService.deleteOtpOfUserEmail);

// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.post('/updateUser', auth, ctrlProfile.updateUser);
router.post('/validatePassword', auth, ctrlProfile.validatePassword);
router.post('/validateThenSetPassword', auth, ctrlProfile.validateThenSetPassword);

// address
router.get('/getAddress', auth, ctrlAddress.getAddress);
router.post('/addAddress', auth, ctrlAddress.addAddress);
router.post('/updateAddress', auth, ctrlAddress.updateAddress);
router.get('/deleteAddress/:id', auth, ctrlAddress.deleteAddress);

// dependent
router.get('/getDependent', auth, ctrlDependent.getDependent);
router.post('/addDependent', auth, ctrlDependent.addDependent);
router.post('/updateDependent', auth, ctrlDependent.updateDependent);
router.get('/deleteDependent/:id', auth, ctrlDependent.deleteDependent);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// developer APIs
router.post('/createNewUserByEmail', ctrlProfile.createNewUserByEmail);
router.get('/findAllUsers', ctrlProfile.findAllUsers);
router.post('/deleteUserByEmail', ctrlProfile.deleteUserByEmail);

module.exports = router;