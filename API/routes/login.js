const router = require('express').Router();

// this url is relatively 'login/'
router.get('/', function (req, res, next) {
    res.send('I2H RESTful API');
});

router.post('/generateOtp', function (req, res, next) {
    const otpObj = {
        otp : generateOTP(6),
        mobNo : req.body.mobNo
    };
    console.log('OTP generated: ', otpObj.otp, ' for mobile no:', otpObj.mobNo);
    // send otpObj.otp on SMS for mobNo
    res.send(otpObj);
});

function generateOTP(digits) {
    const adder = Math.pow(10, (digits-1));
    const multiplier = Math.random() * 9 * Math.pow(10, (digits - 1));
    const otp = Math.floor(adder + multiplier);
    return otp;
}

// this should be in UI
function deleteOtpObjLater() {
    setTimeout(function () { otpObj.otp = null}, 1000 * 60 * 5);
}

module.exports = router;