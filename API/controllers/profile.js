var mongoose = require('mongoose');
var User = mongoose.model('User');
var ApiMessages = require('../config/api-messages');
var ApiResponse = require('../config/api-response');
var mailerService = require('../config/mailer-service');
// var uuid = require('node-uuid');
const logger = require('../config/logger');

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
const createNewUserwithOnlyEmail =function (emailId) {
    logger.debug('executing createNewUserwithOnlyEmail()');
    var user = new User();
    user.email = emailId;
    user.otpList = [];
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    user.updated_at = currentDate;
    // if created_at doesn't exist, add to that field
    if (!user.created_at)
        user.created_at = currentDate;
    user.save(function (err, usr) {
        logger.debug('User created with email:', emailId); // saving user takes time
    });
    return user;
};
// module.exports.createNewUserwithOnlyEmail = createNewUserwithOnlyEmail; // should not be available directly

module.exports.handleUserByEmail = function (emailId, createIfNotFound, callbackFn) {
    User.findOne({ email: emailId }, function (err, user) {
        if (err) { throw err; }
        // if user not found in database then creates new user & returns it
        if (!user) {
            logger.debug('No user found with email', emailId);
            if (createIfNotFound) {
                user = createNewUserwithOnlyEmail(emailId);
            }
        }
        logger.debug('#53 user found in handleUserByEmail', user);
        if (callbackFn) {
            callbackFn(user);
        }
    });
};
// override with userObj except _id, hash, salt
// module.exports.updateUserObjByEmail = function (emailId, userObj) {

//     handleUserByEmail(emailId)
//     .then(function (foundUser) {
//         logger.debug('user found in updateUserObjByEmail', foundUser);
//         delete userObj._id;
//         delete userObj.hash;
//         delete userObj.salt;
//         Object.assign(foundUser, userObj);
//         foundUser.save(function (err) {
//             if (err) throw err;
//             logger.debug(`${key} of User ${emailId} successfully updated with ${val.toString()}`);
//         });
//     })
//     .error(function (error) {
//         logger.debug(error);
//     });
// };



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
