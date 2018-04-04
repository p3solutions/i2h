var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
const ctrlOtpService = require('./otpservice');
const ctrlUtility = require('./utility');
const logger = require('../config/logger');

module.exports.register = function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err)
            logger.error(err);
        user.fname = req.body.fname;
        user.lname = req.body.lname;
        user.dob = req.body.dob;
        user.sex = req.body.sex;
        user.mobile = req.body.mobile;
        user.otpList = [];
        user.setPassword(req.body.password);
        logger.debug('#19 Saving user details in register() ->', user);
        user.save(function (err, user) {
            if (err) {
                logger.error(err);
                ctrlUtility.sendJSONresponse(res, 503, { 'token': user.generateJwt(), 'hasUserInfo': false, 'message': 'Service Unavailable' });
            }
            ctrlUtility.sendJSONresponse(res, 200, { 'token': user.generateJwt(), 'hasUserInfo': true, 'message': 'Saved successfully' });
        });
    });
};

module.exports.login = function (req, res) {
    console.log('login fn entered');
    // checking for OTP login
    const emailId = req.body.email;
    const otp = req.body.otp;
    if (otp) {
        let validation = false;
        User.findOne({ email: emailId }, function (err, foundUser) {
            if (err) { throw err; }
            // if user not found in database then creates new user & returns it
            if (!foundUser) {
                logger.info(`#40 Wrong Email. No user found with email: ${emailId}`);
                ctrlUtility.sendJSONresponse(res, 401, { 'message': 'User not found' });
                return;
            }
            // logger.debug('validate otpList -> ', foundUser.otpList);
            const otpInfo = ctrlUtility.getWholeObjFromArrayByVal(foundUser.otpList, 'otp', otp);
            // logger.debug(otpInfo, ' <- otpInfo');
            if (otpInfo && otpInfo.validity) {
                const currTime = (new Date()).getTime();
                // logger.debug('comparing', otpInfo, ' >= ', currTime);
                validation = (otpInfo.validity >= currTime); // checking for otp-validity, returns true/false
            }
            logger.info(`#52 OTP validation: ${validation}`);
            if (validation) {
                ctrlOtpService.deleteOtpList(emailId);
                // send login notification
                ctrlUtility.sendJSONresponse(res, 200, { 'token': foundUser.generateJwt(), 'hasUserInfo': (!!foundUser.fname), 'message': 'Login Successful'});
            } else {
                ctrlUtility.sendJSONresponse(res, 401, {'message': 'Invalid OTP'});
                return;
            }
        });
    } else {
        console.log('passport.authenticate fn');
        
        passport.authenticate('local', function (err, user, info) {
            console.log('passport.authenticate fn entered');
            
            var token;
            // If Passport throws/catches an error
            if (err) {
                logger.error('error in login->', err);
                ctrlUtility.sendJSONresponse(res, 404, err);
                return;
            }
            console.log('found user in login>psprt->', user.email);
            
            logger.info(`#71 Login via password:\n User: ${user ? user.email : 'NULL'} \n ${info ? JSON.stringify(info) : ''}`);
            // If a user is found
            if (user) {
                token = user.generateJwt();
                ctrlUtility.sendJSONresponse(res, 200, { 'token': token, 'hasUserInfo': (!!user.fname), 'message': 'Login Successful' });
            } else {
                // If user is not found
                ctrlUtility.sendJSONresponse(res, 401, info);
            }
        })(req, res);
    }
};
