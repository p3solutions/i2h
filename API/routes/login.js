const router = require('express').Router();
const configs = require('../config');
const tempOtpMap = new Map();
const successObj = {status: 200};
const loginErrObj = {status: 401}
const accountController = require('../controllers/account');

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
    if (tempOtpMap.get(email) === otp) {
        resp.status = 200;
    } else {
        resp.status = 401;
    }
    // logs
    console.log('loging via OTP: ', otp, ' for mail:', email);
    for (var value of tempOtpMap.values()) {
        console.log(value);
    }
    
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
    } while (otp === tempOtpMap.get(email));
    tempOtpMap.set(email, otp.toString());
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
    setTimeout(function () { tempOtpMap.delete(email); }, configs.OTPdeletionTime);
}

module.exports = router;