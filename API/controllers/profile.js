const me = this;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var mailerService = require('../config/mailerservice');
// var uuid = require('node-uuid');
const ctrlUtility = require('./utility');
const ctrlOtpService = require('./otpservice');

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
module.exports.createNewUserwithOnlyEmail = createNewUserwithOnlyEmail;

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
            ctrlUtility.sendJSONresponse(res, 201, {
                'status': 'Success',
                'message': 'New user created for ' + emailId
            });
            return;
        };
        ctrlUtility.handleUserByEmail(emailId, true, callbackUserFound, callbackUserCreated, null);
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
        ctrlUtility.handleUserByEmail(emailId, false, callbackUserFound, callbackUserNotFound, null);
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


// override with userObj except _id, hash, salt
module.exports.updateUser = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            'success': 'false',
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        const callbackUserFound = function (foundUser) {
            // console.logD('req body', req.body);
            req.body.fname ? foundUser.fname = req.body.fname : '';
            req.body.lname ? foundUser.lname = req.body.lname : '';
            req.body.dob ? foundUser.dob = req.body.dob : '';
            req.body.sex ? foundUser.sex = req.body.sex : '';
            req.body.mobile ? foundUser.mobile = req.body.mobile : '';
            foundUser.otpList = [];
            // console.logD('b4 save', foundUser);
            foundUser.save(function (err, user) {
                if (err) {
                    console.logE(err);
                    ctrlUtility.sendJSONresponse(res, 503, { 'status': 'error', 'message': 'Service Unavailable' });
                    return;
                }
                console.logI('User updated successfully -> ', user.email);
                ctrlUtility.sendJSONresponse(res, 200, { 'status': 'Success', 'message': 'User updated successfully' });
                return;
            });
        };
        const callbackUserNotFound = function (foundUser) {
            ctrlUtility.sendJSONresponse(res, 404, {
                'status': 'Error',
                'message': 'User not found'
            });
        };
        try {
            ctrlUtility.handleUserById(req.payload._id, callbackUserFound, callbackUserNotFound, null)
        } catch (err) {
            console.logE(err);
        }
    }
};

module.exports.validatePassword = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            'success': 'false',
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        const password = req.body.password;
        const callbackUserFound = function (foundUser) {
            if (!foundUser.validPassword(password)) {
                console.logD('wrong password');
                ctrlUtility.sendJSONresponse(res, 203, { 'status': 'error', 'message': 'Password is wrong' });
                return;
            }
            console.logD('password verified');
            ctrlUtility.sendJSONresponse(res, 202, { 'status': 'success', 'message': 'Password is correct' });
            return;
        };
        const callbackUserNotFound = function (foundUser) {
            ctrlUtility.sendJSONresponse(res, 404, {
                'status': 'Error',
                'message': 'User not found'
            });
            return;
        };
        try {
            ctrlUtility.handleUserById(req.payload._id, callbackUserFound, callbackUserNotFound, null)
        } catch (err) {
            console.logE(err);
        }
    }
};

module.exports.validateThenSetPassword = function (req, res) {
    const _id = req.payload._id;
    if (!_id) {
        res.status(401).json({
            'success': 'false',
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        const newPassword = req.body.newPassword;
        // validate old password
        const password = req.body.password;
        if (password) {
            const callbackUserFound = function (foundUser) {
                if (!foundUser.validPassword(password)) {
                    console.logD('wrong password');
                    ctrlUtility.sendJSONresponse(res, 203, { 'status': 'error', 'message': 'Old password mismatch' });
                    return;
                }
                console.logD('password verified, old->', foundUser.hash);
                foundUser.setPassword(newPassword);
                console.logD('password verified, new->', foundUser.hash);
                 foundUser.save(function (err, user) {
                    if (err) {
                        console.logE(err);
                        ctrlUtility.sendJSONresponse(res, 503, { 'status': 'error', 'message': 'Service Unavailable' });
                        return;
                    }
                    ctrlUtility.sendJSONresponse(res, 202, { 'status': 'success', 'message': 'Password changed successfully' });
                    return;
                });
            };
            const callbackUserNotFound = function (foundUser) {
                ctrlUtility.sendJSONresponse(res, 404, { 'status': 'error', 'message': 'User not found' });
                return;
            };
            try {
                ctrlUtility.handleUserById(_id, callbackUserFound, callbackUserNotFound, null)
            } catch (err) {
                console.logE(err);
            }
        } else {
        // validate OTP
            const otp = req.body.otp;
            const callbackUserFound = function (foundUser) {
                const validation = ctrlUtility.isValidOTP(foundUser.otpList, req.body.otp);
                if (validation) {
                    ctrlOtpService.deleteOtpList({ _id: _id });
                    console.logD('otp verified, old->', foundUser.hash);
                    foundUser.setPassword(newPassword);
                    console.logD('otp verified, new->', foundUser.hash);
                     foundUser.save(function (err, user) {
                    if (err) {
                        console.logE(err);
                        ctrlUtility.sendJSONresponse(res, 503, { 'status': 'error', 'message': 'Service Unavailable' });
                        return;
                    }
                    ctrlUtility.sendJSONresponse(res, 200, { 'status': 'success', 'message': 'Password changed successfully' });
                    return;
                });
                } else {
                    console.logD('wrong otp');
                    ctrlUtility.sendJSONresponse(res, 203, { 'message': 'OTP mismatch' });
                    return;
                }
            };
            const callbackUserNotFound = function (foundUser) {
                ctrlUtility.sendJSONresponse(res, 404, { 'status': 'error', 'message': 'User not found' });
                return;
            };
            try {
                ctrlUtility.handleUserById(_id, callbackUserFound, callbackUserNotFound, null)
            } catch (err) {
                console.logE(err);
            }
        }
    }
};

// Manage Address API

module.exports.getAddress = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            'success': 'false',
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        const callbackUserFound = function (foundUser) {
            const address = foundUser.address;
            // console.logD(address, ' <- add existed');
            ctrlUtility.sendJSONresponse(res, 200, { 'status': 'success', 'address': address });
            return;
        };
        const callbackUserNotFound = function (foundUser) {
            ctrlUtility.sendJSONresponse(res, 404, {
                'status': 'Error',
                'message': 'User not found'
            });
            return;
        };
        try {
            ctrlUtility.handleUserById(req.payload._id, callbackUserFound, callbackUserNotFound, null)
        } catch (err) {
            console.logE(err);
        }
    }
};

module.exports.addAddress = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            'success': 'false',
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        const addressObj = req.body.addressObj;
        const callbackUserFound = function (foundUser) {
            const address = foundUser.address;
            // new addressObj id = previous id + 1
            const lastObjId = address.length ? Number(address[address.length - 1].id) + 1 : 1;
            addressObj.id = lastObjId.toString();
            if (!addressObj.default) {
                addressObj.default = false;
            }
            address.push(addressObj);
            foundUser.save(function (err, user) {
                if (err) {
                    console.logE(err);
                    ctrlUtility.sendJSONresponse(res, 503, { 'status': 'error', 'message': 'Service Unavailable' });
                    return;
                }
                console.logD('address added');
                ctrlUtility.sendJSONresponse(res, 200, {
                    'status': 'success',
                    'message': 'Address added successfully',
                    'lastObjId': lastObjId
                });
                return;
            });
        };
        const callbackUserNotFound = function (foundUser) {
            ctrlUtility.sendJSONresponse(res, 404, {
                'status': 'Error',
                'message': 'User not found'
            });
            return;
        };
        try {
            ctrlUtility.handleUserById(req.payload._id, callbackUserFound, callbackUserNotFound, null)
        } catch (err) {
            console.logE(err);
        }
    }
};


// module.exports.updateAddress = function (req, res) {
//     if (!req.payload._id) {
//         res.status(401).json({
//             'success': 'false',
//             'message': 'UnauthorizedError: private profile'
//         });
//     } else {
//         const addressObj = req.body.addressObj;
//         console.logD('passed add\n', addressObj);
//         const callbackUserFound = function (foundUser) {
//             const addressArray = foundUser.address;
//             let  updateObj = {};
//             for (let i = 0; i < addressArray.length; i++) {
//                 console.logD('chking id', addressArray[i].id);
//                 if (addressArray[i].id.toString() === addressObj.id.toString()) {
//                     addressArray[i] = addressObj;
//                     console.logD('array modified');
//                     break;
//                 }
//             }
//             foundUser.save(function (err, user) {
//                 if (err) {
//                     console.logE(err);
//                     ctrlUtility.sendJSONresponse(res, 503, { 'status': 'error', 'message': 'Service Unavailable' });
//                     return;
//                 }
//                 console.log('updated scsfly', user.address);
//                 ctrlUtility.sendJSONresponse(res, 200, {
//                     'status': 'success',
//                     'message': 'Address updated successfully'
//                 });
//                 return;
//             });
//         };
//         const callbackUserNotFound = function (foundUser) {
//             ctrlUtility.sendJSONresponse(res, 404, {
//                 'status': 'Error',
//                 'message': 'User not found'
//             });
//             return;
//         };
//         try {
//             ctrlUtility.handleUserById(req.payload._id, callbackUserFound, callbackUserNotFound, null)
//         } catch (err) {
//             console.logE(err);
//         }
//     }
// };


module.exports.updateAddress = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            'success': 'false',
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        const addressObj = req.body.addressObj;
        const callbackUserFound = function (foundUser) {
            const address = foundUser.address;
            const newAddressArray = [];
            for (let i = 0; i < address.length; i++) {
                if (address[i].id.toString() === addressObj.id.toString()) {
                    if (addressObj.default) { // set false for all except the current addresObj
                        console.logD('Making default address to address-id ', addressObj.id);
                    }                    
                    newAddressArray.push(addressObj);
                } else{
                    if (addressObj.default) { // set false for all except the current addresObj
                        address[i].default = false;
                    }
                    newAddressArray.push(address[i]);
                }
            }
            foundUser.address = newAddressArray;
            foundUser.save(function (err, user) {
                if (err) {
                    console.logE(err);
                    ctrlUtility.sendJSONresponse(res, 503, { 'status': 'error', 'message': 'Service Unavailable' });
                    return;
                }
                console.logD('address updated');
                ctrlUtility.sendJSONresponse(res, 200, {
                    'status': 'success',
                    'message': 'Address updated successfully'
                });
                return;
            });
        };
        const callbackUserNotFound = function (foundUser) {
            ctrlUtility.sendJSONresponse(res, 404, {
                'status': 'Error',
                'message': 'User not found'
            });
            return;
        };
        try {
            ctrlUtility.handleUserById(req.payload._id, callbackUserFound, callbackUserNotFound, null)
        } catch (err) {
            console.logE(err);
        }
    }
};

module.exports.deleteAddress = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            'success': 'false',
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        const id = req.params.id;
        const callbackUserFound = function (foundUser) {
            let flag = false;
            const address = foundUser.address;
            console.logD('deleting passed id->', id);
            for(let i = 0; i < address.length; i++) { // id may not be in order so iterate full
                if (address[i].id.toString() === id.toString()) {
                    address.splice(i, 1);
                    flag = true;
                    break;
                }
            }
            foundUser.save(function (err, user) {
                if (err) {
                    console.logE(err);
                    ctrlUtility.sendJSONresponse(res, 503, { 'status': 'error', 'message': 'Service Unavailable' });
                    return;
                }
                if (flag) {
                console.logD('address deleted');
                    ctrlUtility.sendJSONresponse(res, 200, {
                        'status': 'success',
                        'message': 'Address deleted successfully',
                        'totalAddress': address.length
                    });
                } else {
                    ctrlUtility.sendJSONresponse(res, 203, {
                        'status': 'error',
                        'message': 'Address id does not exist',
                        'totalAddress': address.length
                    });
                }
                return;
            });
        };
        const callbackUserNotFound = function (foundUser) {
            ctrlUtility.sendJSONresponse(res, 404, {
                'status': 'Error',
                'message': 'User not found'
            });
            return;
        };
        try {
            ctrlUtility.handleUserById(req.payload._id, callbackUserFound, callbackUserNotFound, null)
        } catch (err) {
            console.logE(err);
        }
    }
};

// addressObj.tag ? addressArray[i].tag = addressObj.tag.trim() : '';
// addressObj.name ? addressArray[i].name = addressObj.name.trim() : '';
// addressObj.contact ? addressArray[i].contact = addressObj.contact.trim() : '';
// addressObj.address ? addressArray[i].address = addressObj.address.trim() : '';
// addressObj.city ? addressArray[i].city = addressObj.city.trim() : '';
// addressObj.pincode ? addressArray[i].pincode = addressObj.pincode.trim() : '';
// addressObj.locality ? addressArray[i].locality = addressObj.locality.trim() : '';
// addressObj.state ? addressArray[i].state = addressObj.state.trim() : '';
// addressObj.landmark ? addressArray[i].landmark = addressObj.landmark.trim() : '';
// addressObj.altContact ? addressArray[i].altContact = addressObj.altContact.trim() : '';
// addressObj.default ? addressArray[i].default = addressObj.default : '';


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
