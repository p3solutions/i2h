var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
const ctrlOtpService = require('./otpservice');
const ctrlUtility = require('./utility');
module.exports.register = function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err)
            console.logE(err);
        user.fname = req.body.fname;
        user.lname = req.body.lname;
        user.dob = req.body.dob;
        user.sex = req.body.sex;
        user.mobile = req.body.mobile;
        user.otpList = [];
        user.setPassword(req.body.password);
        console.logD('#19 Saving user details in register() ->', user);
        user.save(function (err, user) {
            if (err) {
                console.logE(err);
                ctrlUtility.sendJSONresponse(res, 503, { 'token': user.generateJwt(), 'hasUserInfo': false, 'message': 'Service Unavailable' });
            }
            ctrlUtility.sendJSONresponse(res, 200, { 'token': user.generateJwt(), 'hasUserInfo': true, 'message': 'Saved successfully' });
        });
    });
};

module.exports.login = function (req, res) {
    const emailId = req.body.email;
    const password = req.body.password;
    const otp = req.body.otp;
    if (password) { // checking for password login
        passport.authenticate('local', function (err, user, info) {
            var token;
            // If Passport throws/catches an error
            if (err) {
                console.logE('error in login->', err);
                ctrlUtility.sendJSONresponse(res, 404, err);
                return;
            }
            console.logI(`Login via password -> ${info ? JSON.stringify(info) : ''}`);
            // If a user is found
            if (user) {
                token = user.generateJwt();
                ctrlUtility.sendJSONresponse(res, 200, { 'token': token, 'hasUserInfo': (!!user.fname), 'message': 'Login Successful' });
            } else {
                // If user is not found
                ctrlUtility.sendJSONresponse(res, 401, info);
            }
        })(req, res);
    } else if (otp) { // checking for OTP login
        const paramObject = {email: emailId};
        User.findOne(paramObject, function (err, foundUser) {
            if (err) { throw err; }
            if (!foundUser) {
                console.logI(`Wrong Email. No user found with email: ${emailId}`);
                ctrlUtility.sendJSONresponse(res, 401, { 'message': 'User not found' });
                return;
            }
            const validation = ctrlUtility.isValidOTP(foundUser.otpList, req.body.otp);
            console.logI(`OTP validation: ${validation}`);
            if (validation) {
                ctrlOtpService.deleteOtpList(paramObject);
                // send login notification
                ctrlUtility.sendJSONresponse(res, 200, { 'token': foundUser.generateJwt(), 'hasUserInfo': (!!foundUser.fname), 'message': 'Login Successful'});
            } else {
                ctrlUtility.sendJSONresponse(res, 401, {'message': 'Invalid OTP'});
                return;
            }
        });
    }
};
