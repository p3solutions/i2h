const configs = require('../config/config');
const tempOtpMap = new Map();

var getSetOTP = function(email) {
    let otp;
    do {
        otp = generateOTP();
        console.log('generated otp:', otp);
    } while (otp === tempOtpMap.get(email));
    tempOtpMap.set(email, otp.toString());
    // send otp to the email id
    deleteOtpEntryLater(email);
    console.log('otp to be mailed', otp);
    return otp;
};

var generateOTP = function() {
    const digits = configs.OTPdigits;
    const adder = Math.pow(10, (digits - 1));
    const multiplier = Math.random() * 9 * Math.pow(10, (digits - 1));
    const otp = Math.floor(adder + multiplier);
    return otp;
};

var deleteOtpEntryLater = function(email) {
    setTimeout(function () { tempOtpMap.delete(email); }, configs.OTPdeletionTime);
};

module.exports.mailotp = function (req, res) {
    const otp = getSetOTP(req.body.email);
    console.log('OTP generated: ', otp, ' for mail:', req.body.email);
    // send otp on mail id
    res.status(200);
    res.json({
        'status': 200
    });
};

module.exports.tempOtpMap = tempOtpMap;