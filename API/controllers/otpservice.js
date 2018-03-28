const configs = require('../config/config');
const logger = require('../config/logger');
var ctrlProfile = require('../controllers/profile');
const ctrlUtility = require('./utility');
var User = require('mongoose').model('User');

var generateOTP = function () {
    const digits = configs.OTPdigits;
    const adder = Math.pow(10, (digits - 1));
    const multiplier = Math.random() * 9 * Math.pow(10, (digits - 1));
    const otp = Math.floor(adder + multiplier);
    return otp;
};

var getNewOTP = function (emailId) {
    let otp;
    otp = generateOTP();
    logger.debug('new OTP generated:', otp);
    const validationTime = (new Date()).getTime() + configs.OTPdeletionTime;
    const newOTPobj = {
        otp: otp.toString(),
        validity: validationTime
    };
    const callbackFn = function (foundUser) {
        logger.debug(foundUser, '<-foundUser');
        foundUser.otpList ? foundUser.otpList.push(newOTPobj) : foundUser.otpList = [newOTPobj];
        foundUser.save(function (err, usr) {
            if (err) throw err;
            logger.debug('otpList updateUserOtpList', foundUser.otpList);
            logger.info(`${usr.email} details saved to DB`);
        });
    };
    ctrlProfile.handleUserByEmail(emailId, true, callbackFn); // this true param ensure that it will always return a user
    logger.info('OTP to be mailed ', otp);
    return otp;
};

const deleteOtpList = function (emailId) {
    // saving empty array in otpList in the DB
    const callbackFn = function (foundUser) {
        foundUser.otpList = [];
        foundUser.save(function (err, usr) {
            if (err) throw err;
            logger.info(`${usr.email} otpList is deleted & saved to DB`);
        });
    };
    ctrlProfile.handleUserByEmail(emailId, false, callbackFn) // logically that should return a user, i.e. we should always call this for an exisiting user
};
module.exports.deleteOtpList = deleteOtpList;

module.exports.mailotp = function (req, res) {
    // var returnedObj = ctrlProfile.createNewUserwithOnlyEmail(req.body.email);
    // logger.debug(returnedObj, 'returnedObj');
    // TODO mail restricted to configs.maxCountOTP
    const otp = getNewOTP(req.body.email);
    // send otp to the email id
    // on mail success call
    ctrlUtility.sendJSONresponse(res, 200, {'status': 200});
};
