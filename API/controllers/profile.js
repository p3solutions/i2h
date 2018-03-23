var mongoose = require('mongoose');
var User = mongoose.model('User');
var ApiMessages = require('../config/api-messages');
var ApiResponse = require('../config/api-response');
var mailerService = require('../config/mailer-service');
// var uuid = require('node-uuid');

module.exports.profileRead = function (req, res) {

    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                res.status(200).json(user);
            });
    }

};
/*
// reset password & send mail to user
module.exports.resetPassword = function (email, callback) {
    var me = this;
    me.userModel.findOne({ email: email }, function (err, user) {
        if (err) {
            return callback(err, new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } }));
        }
        // Save the user's email and a password reset hash in session. We will use
        var passwordResetHash = uuid.v4();
        me.session.passwordResetHash = passwordResetHash;
        me.session.emailWhoRequestedPasswordReset = email;
        mailerService.mailer.sendPasswordResetHash(email, passwordResetHash);
        return callback(err, new ApiResponse({ success: true, extras: { passwordResetHash: passwordResetHash } }));
    });
};

// change password
module.exports.resetPasswordFinal = function (email, newPassword, passwordResetHash, callback) {
    var me = this;
    if (!me.session || !me.session.passwordResetHash) {
        return callback(null, new ApiResponse({ success: false, extras: { msg: ApiMessages.PASSWORD_RESET_EXPIRED } }));
    }
    if (me.session.passwordResetHash !== passwordResetHash) {
        return callback(null, new ApiResponse({ success: false, extras: { msg: ApiMessages.PASSWORD_RESET_HASH_MISMATCH } }));
    }
    if (me.session.emailWhoRequestedPasswordReset !== email) {
        return callback(null, new ApiResponse({ success: false, extras: { msg: ApiMessages.PASSWORD_RESET_EMAIL_MISMATCH } }));
    }
    var passwordSalt = this.uuid.v4();
    me.hashPassword(newPassword, passwordSalt, function (err, passwordHash) {
        me.userModel.update({ email: email }, { passwordHash: passwordHash, passwordSalt: passwordSalt }, function (err, numberAffected, raw) {
            if (err) {
                return callback(err, new ApiResponse({ success: false, extras: { msg: ApiMessages.DB_ERROR } }));
            }
            if (numberAffected < 1) {
                return callback(err, new ApiResponse({ success: false, extras: { msg: ApiMessages.COULD_NOT_RESET_PASSWORD } }));
            } else {
                return callback(err, new ApiResponse({ success: true, extras: null }));
            }
        });
    });
};
*/
