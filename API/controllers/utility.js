var mongoose = require('mongoose');
const User = mongoose.model('User');
var ctrlProfile = require('../controllers/profile');

// set array-obj val into the key
module.exports.updateArrayOfObj = function(myArray, key, val) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i][key] === key) {
            myArray[i][key] = val;
            console.logD(`${key} updated with ${val}`);
            break;
        }
    }
};

// if found return true, else returns false
module.exports.searchInArrayOfObj = function (myArray, ObjKey, val) {
    const flag = false;
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i][ObjKey] === val) {
            flag = true;
            console.logD(`found key:${ObjKey} , val:${val}`);
            break;
        }
    }
    return flag;
};
// if found return the obj, else returns null
const getWholeObjFromArrayByVal = function (myArray, ObjKey, val) {
    let item = null;
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i][ObjKey] === val) {
            item = myArray[i];
            console.logD(`found obj in getWholeObjFromArrayByVal(): ${JSON.stringify(item)}`);
            break;
        }
    }
    return item;
};
module.exports.getWholeObjFromArrayByVal = getWholeObjFromArrayByVal;

module.exports.isValidOTP = function (otpList, otp) {
    let validation = false;
    const otpInfo = getWholeObjFromArrayByVal(otpList, 'otp', otp);
    console.logD(otpInfo, ' <- otpInfo');
    if (otpInfo && otpInfo.validity) {
        const currTime = (new Date()).getTime();
        console.logD('comparing', otpInfo, ' >= ', currTime);
        validation = (otpInfo.validity >= currTime); // checking for otp-validity, returns true/false
    }
    console.logI(`OTP validation: ${validation}`);
    return validation;
};

module.exports.sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.handleUserById = function (id, callbackUserFound, callbackUserNotFound, finalCallback) {
    User.findOne({ _id: id }, function (err, user) {
        if (err) { throw err; }
        if (user) {
            callbackUserFound ? callbackUserFound(user) : true;
        } else {
            callbackUserNotFound ? callbackUserNotFound(user) : true;
        }
        if (finalCallback) {
            finalCallback(user);
        }
    });
};

// make sure res return in callbacks, specially if createIfNotFound == false, res must return in callbackUserFound or finalCallback, else API response never end until timeout
module.exports.handleUserByEmail = function (emailId, createIfNotFound, callbackUserFound, callbackUserCreated, finalCallback) {
    User.findOne({ email: emailId }, function (err, user) {
        if (err) { throw err; }
        // console.logD(`#47 User found in handleUserByEmail: ${user.email}`);
        if (user) {
            callbackUserFound ? callbackUserFound(user) : true;
        }
        // if user not found in database then creates new user & returns it
        else {
            if (createIfNotFound) {
                user = ctrlProfile.createNewUserwithOnlyEmail(emailId);
            }
            callbackUserCreated ? callbackUserCreated(user) : true;
        }
        if (finalCallback) {
            finalCallback(user);
        }
    });
};