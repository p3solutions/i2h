const me = this;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var mailerService = require('../config/mailerservice');
// var uuid = require('node-uuid');
const ctrlUtility = require('./utility');

module.exports.profileRead = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                if (err) console.logE(err);
                const userCopy = JSON.parse(JSON.stringify(user));
                console.logD(`user found for ${userCopy.email} with fname ${userCopy.fname}`);
                delete userCopy.updated_at;
                delete userCopy.created_at;
                delete userCopy.otpList;
                delete userCopy.hash;
                delete userCopy.salt;
                delete userCopy.__v;
                res.status(200).json(userCopy);
            });
    }
};
const createNewUserwithOnlyEmail = function (emailId) {
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
        if (err) throw err;
        console.logI(`#39 User created with email: ${emailId}`); // saving user takes time
    });
    return user;
};
// make sure res return in callbacks, specially if createIfNotFound == false, res must return in callbackUserFound or finalCallback, else API response never end until timeout
const handleUserByEmail = function (emailId, createIfNotFound, callbackUserFound, callbackUserCreated, finalCallback) {
    User.findOne({ email: emailId }, function (err, user) {
        if (err) { throw err; }
        // console.logD(`#47 User found in handleUserByEmail: ${user.email}`);
        if (user) {
            callbackUserFound ? callbackUserFound(user) : true;
        }
        // if user not found in database then creates new user & returns it
        else {
            if (createIfNotFound) {
                user = createNewUserwithOnlyEmail(emailId);
            }
            callbackUserCreated ? callbackUserCreated(user) : true;
        }
        if (finalCallback) {
            finalCallback(user);
        }
    });
};
module.exports.handleUserByEmail = handleUserByEmail;

// should be available only to developers
module.exports.createNewUserByEmail = function (req, res) {
    const emailId = req.body.email;
    try {
        const callbackUserFound = function (foundUser) {
            ctrlUtility.sendJSONresponse(res, 200, {
                'status': 'Success',
                'message': 'User already exist for ' + emailId
            });
            return;
        };
        const callbackUserCreated = function (foundUser) {
            ctrlUtility.sendJSONresponse(res, 200, {
                'status': 'Success',
                'message': 'New user created for ' + emailId
            });
            return;
        };
        handleUserByEmail(emailId, true, callbackUserFound, callbackUserCreated, null);
    } catch (error) {
        console.logE(error);
        ctrlUtility.sendJSONresponse(res, 500, {
            'status': 'Error',
            'message': 'Error in creating new user'
        });
        return;
    }
};

// should be available only to developers
module.exports.deleteUserByEmail = function (req, res) {
    const emailId = req.body.email;
    try {
        const callbackUserFound = function (foundUser) {
            foundUser.remove(function (err) {
                if (err) throw err;
                ctrlUtility.sendJSONresponse(res, 200, {
                    'status': 'Success',
                    'message': 'User deleted successfully for ' + emailId
                });
                return;
            });
        };
        const callbackUserNotFound = function (foundUser) {
            ctrlUtility.sendJSONresponse(res, 404, {
                'status': 'Error',
                'message': 'User not found for ' + emailId
            });
            return;
        };
        handleUserByEmail(emailId, false, callbackUserFound, callbackUserNotFound, null);
    } catch (error) {
        console.logE(error);
        ctrlUtility.sendJSONresponse(res, 500, {
            'status': 'Error',
            'message': 'Error in deleting user ' + emailId
        });
        return;
    }
};

module.exports.findAllUsers = function (req, res) {
    const onlyEmail = req.query.onlyEmail;
    let foundUser = {total:0, users: []};
    try {
        // get all the users
        User.find({}, function (err, users) {
            if (err) throw err;
            if (onlyEmail) {
                users.forEach(usr => {
                    foundUser.users.push(usr.email);
                });
            } else {
                foundUser.users = users;
            }
            foundUser.total = users.length;
            // object of all the users
            console.logD('findAllUsers() found users -> ', foundUser.total);
            res.send(foundUser);
        });
    } catch (error) {
        console.logE(error);
        ctrlUtility.sendJSONresponse(res, 500, {
            'status': 'Error',
            'message': 'Error in deleting user ' + emailId
        });
        return;
    }
};

const handleUserById = function (id, callbackUserFound, callbackUserCreated, finalCallback) {
    User.findOne({ _id: id }, function (err, user) {
        if (err) { throw err; }
        if (user) {
            callbackUserFound ? callbackUserFound(user) : true;
        }
        // if user not found in database then creates new user & returns it
        else {
            callbackUserCreated ? callbackUserCreated(user) : true;
        }
        if (finalCallback) {
            finalCallback(user);
        }
    });
};
// override with userObj except _id, hash, salt
module.exports.updateUser = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            'success': 'false',
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        const callbackUserFound = function (foundUser) {
            console.logD('req body', req.body);
            req.body.fname ? foundUser.fname = req.body.fname : '';
            req.body.lname ? foundUser.lname = req.body.lname : '';
            req.body.dob ? foundUser.dob = req.body.dob : '';
            req.body.sex ? foundUser.sex = req.body.sex : '';
            req.body.mobile ? foundUser.mobile = req.body.mobile : '';
            foundUser.otpList = [];
            console.logD('b4 save', foundUser);
            foundUser.save(function (err, user) {
                if (err) {
                    console.logE(err);
                    ctrlUtility.sendJSONresponse(res, 503, { 'status': 'error', 'message': 'Service Unavailable' });
                }
                ctrlUtility.sendJSONresponse(res, 200, { 'status': 'Success', 'message': 'User updated successfully' });
                console.logI('User updated successfully -> ', user.email);
            });
        };
        const callbackUserNotFound = function (foundUser) {
            ctrlUtility.sendJSONresponse(res, 404, {
                'status': 'Error',
                'message': 'User not found'
            });
        };
        try {
            handleUserById(req.payload._id, callbackUserFound, callbackUserNotFound, null)
        } catch (err) {
            console.logE(err);
        }
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
