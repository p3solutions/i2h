const router = require('express').Router();
const configs = require('../config');
const otpMap = new Map();
// this url is relatively 'login/'
router.get('/', function (req, res, next) {
    res.send('I2H RESTful API');
});

router.post('/mailOTP', function (req, res, next) {
    console.log('res->', req.body);
    const otp = getSetOTP(req.body.email);
    console.log('OTP generated: ', otp, ' for mail:', req.body.email);
    // send otp on mail id
    res.json({status: 200});
});

router.post('/otp', function (req, res, next) {
    console.log('res->', req.body);
    const email = req.body.email;
    const otp = req.body.otp;
    if (otpMap.get(email) === otp) {
        res.status = 200;
    } else {
        res.status = 401
    }
    console.log('loging via OTP: ', otp, ' for mail:', email);
    // send otp on mail id
    res.json({ status: 200 });
});

function getSetOTP(email) {
    let otp;
    do {
        otp = generateOTP();
        console.log('generated otp:', otp);
    } while (otp === otpMap.get(email));
    otpMap.set(email, otp);
    console.log('otp to be mailed', otp);
    // send otp to the email id
    deleteOtpEntryLater(email);
    return otp;
}

function generateOTP() {
    const digits = configs.OTPdigits;
    const adder = Math.pow(10, (digits-1));
    const multiplier = Math.random() * 9 * Math.pow(10, (digits - 1));
    const otp = Math.floor(adder + multiplier);
    return otp;
}

// this should be in UI
function deleteOtpEntryLater(email) {
    setTimeout(function () { otpMap.delete(email); }, configs.OTPdeletionTime);
}

module.exports = router;