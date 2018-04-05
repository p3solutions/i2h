const configs = require('../config/config');
var ctrlProfile = require('../controllers/profile');
const ctrlUtility = require('./utility');
var User = require('mongoose').model('User');
const mailerService = require('../config/mailerservice');

var generateOTP = function () {
    const digits = configs.OTP_DIGITS;
    const adder = Math.pow(10, (digits - 1));
    const multiplier = Math.random() * 9 * Math.pow(10, (digits - 1));
    const otp = Math.floor(adder + multiplier);
    return otp;
};

var getNewOTP = function (emailId) {
    let otp;
    otp = generateOTP();
    console.logD('new OTP generated:', otp);
    const validationTime = (new Date()).getTime() + configs.OTP_VALIDATION_DELAY;
    const newOTPobj = {
        otp: otp.toString(),
        validity: validationTime
    };
    const callbackFn = function (foundUser) {
        console.logD(foundUser.email, ' <- foundUser');
        foundUser.otpList ? foundUser.otpList.push(newOTPobj) : foundUser.otpList = [newOTPobj];
        foundUser.save(function (err, usr) {
            if (err) console.logE(err);
            console.logD('otpList updateUserOtpList ', foundUser.otpList);
            console.logI(`${usr.email} details saved to DB`);
        });
    };
    ctrlProfile.handleUserByEmail(emailId, true, null, null, callbackFn); // this true param ensure that it will always return a user
    console.logI('OTP to be mailed ', otp);
    return otp;
};

const deleteOtpList = function (emailId) {
    // saving empty array in otpList in the DB
    const callbackFn = function (foundUser) {
        foundUser.otpList = [];
        foundUser.save(function (err, usr) {
            if (err) console.logE(err);
            console.logI(`${usr.email} otpList is deleted & saved to DB`);
        });
    };
    ctrlProfile.handleUserByEmail(emailId, false, callbackFn) // logically that should return a user, i.e. we should always call this for an exisiting user
};
module.exports.deleteOtpList = deleteOtpList; // rename deleteUserOTP

module.exports.deleteOtpOfUserEmail = function (req, res) {
    const emailId = req.body.email;
    User.findOne({ email: emailId }, function (err, foundUser) {
        if (err) console.logE(err);
        // if user not found in database then creates new user & returns it
        if (!foundUser) {
            console.logI('wrong email, No user found with email', emailId);
            ctrlUtility.sendJSONresponse(res, 404, { 'message': 'No user found with this email' });
            return;
        }
        if (foundUser.otpList.length > 0) {
            deleteOtpList(emailId);
            ctrlUtility.sendJSONresponse(res, 200, { 'message': 'OTP deleted successfully' });
        } else {
            ctrlUtility.sendJSONresponse(res, 404, { 'message': 'No OTP found' });
        }
        return;
    });
};

module.exports.mailotp = function (req, res) {
    const emailId = req.body.email;
    const otp = getNewOTP(emailId);
    // send otp to the email id
    const otpMailHtml = `Login with this OTP: <b>${otp}</b><br><i>NOTE: Kindly don't share OTP with anyone. This is valid for just ${configs.OTP_VALIDATION_MINUTES} minutes.</i>`;
    const params = {
        to: emailId,
        html: otpMailHtml
    };
    const mailerOptions = mailerService.getmailerOptions(params);
    // console.logD(`#84 Mailer Options: \n${mailerOptions.toString()}`);
    console.logD('#84 Mailer Options:\n' + JSON.stringify(mailerOptions));
    const transporter = mailerService.getTransport();
    const mailCallbackFn = function (err, info) {
        if (err) {
            console.logE(err);
            ctrlUtility.sendJSONresponse(res, 500, {'message': 'Error sending mail for OTP'});
            return;
        }
        console.logD('Mail sent with OTP to: ', emailId);
        ctrlUtility.sendJSONresponse(res, 200, {
            'status': 'success',
            'message': 'OTP mailed successfully'});
        console.logD('info->\n', info);
        return;
    };
    transporter.sendMail(mailerOptions, mailCallbackFn);
};
