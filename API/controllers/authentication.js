var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
const otpService = require('./otpservice');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function (req, res) {

    var user = new User();
    user.email = req.body.email;
    user.fname = req.body.fname;
    user.lname = req.body.lname;
    user.dob = req.body.dob;
    user.sex = req.body.sex;
    user.mobile = req.body.mobile;

    user.setPassword(req.body.password);
    console.log('user->', user);

    user.save(function (err) {
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
            "token": token
        });
    });

};

module.exports.login = function (req, res) {

    // checking for OTP login
    const emailId = req.body.email;
    const otp = req.body.otp;
    if (otp) {
        console.log('login via OTP: ', otp, ' for mail:', emailId);
        for (var value of otpService.tempOtpMap.values()) {
            console.log(value);
        }
        if (otpService.tempOtpMap.get(emailId) === otp) {
            User.findOne({ email: emailId }, function (err, user) {
                if (err) { return sendJSONresponse(res, 404, err); }
                // Return if user not found in database
                if (!user) {
                    // if new user doing nothing, new user can be registered if needed
                    return sendJSONresponse(res, 200, {
                        'message': 'New user found'
                    });
                }
                console.log('user found->', user);
                sendJSONresponse(res, 200, user);
                return;
            });
        } else {
            sendJSONresponse(res, 401, {
                'message': 'Wrong OTP'
            });
            return;
        }
    } else {
        
        passport.authenticate('local', function (err, user, info) {
            var token;
    
            // If Passport throws/catches an error
            if (err) {
            console.log('error in login->', err);
                res.status(404).json(err);
                return;
            }
            console.log('user found->', user);
            // If a user is found
            if (user) {
                token = user.generateJwt();
                res.status(200);
                res.json({
                    "token": token
                });
            } else {
                // If user is not found
                res.status(401).json(info);
            }
        })(req, res);

    }
};
