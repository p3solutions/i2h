const router = require('express').Router();
const configs = require('../config');
const otpMap = new Map();
const successObj = {status: 200};
const loginErrObj = {status: 401}
// this url is relatively 'login/'
router.get('/', function (req, res, next) {
    res.send('I2H RESTful API');
});

router.post('/mailOTP', (req, res, next) => {
    // console.log('res->', req.body);
    const otp = getSetOTP(req.body.email);
    console.log('OTP generated: ', otp, ' for mail:', req.body.email);
    // send otp on mail id
    res.json(successObj);
});

router.post('/otp', (req, res, next) => {
    console.log('res->', req.body);
    const email = req.body.email;
    const otp = req.body.otp;
    let resp = {};
    if (otpMap.get(email) === otp) {
        resp.status = 200;
    } else {
        resp.status = 401;
    }
    console.log('loging via OTP: ', otp, ' for mail:', email);
    for (var value of otpMap.values()) {
        console.log(value);
    }
    // send otp on mail id
    res.json(resp);
});
router.post('/password', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    // db matching username-password
    res.json(successObj);
});

router.post('/saveUserInfo', (req, res, next) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const dob = req.body.dob;
    const sex = req.body.sex;
    const mobile = req.body.mobile;
    const password = req.body.password;
    console.log(fname, lname, dob, sex, mobile, password);
    // db matching username-password
    res.json(successObj);
});

function getSetOTP(email) {
    let otp;
    do {
        otp = generateOTP();
        console.log('generated otp:', otp);
    } while (otp === otpMap.get(email));
    otpMap.set(email, otp.toString());
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