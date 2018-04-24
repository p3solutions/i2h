const ctrlUtility = require('./utility');

module.exports.getDependent = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            'success': 'false',
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        const callbackUserFound = function (foundUser) {
            const dependent = foundUser.dependent;
            // console.logD(dependent, ' <- add existed');
            ctrlUtility.sendJSONresponse(res, 200, { 'status': 'success', 'dependent': dependent });
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

module.exports.addDependent = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            'success': 'false',
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        const dependentObj = req.body.dependentObj;
        const callbackUserFound = function (foundUser) {
            const dependent = foundUser.dependent;
            // new dependentObj id = previous id + 1
            const lastObjId = dependent.length ? Number(dependent[dependent.length - 1].id) + 1 : 1;
            dependentObj.id = lastObjId.toString();
            if (!dependentObj.default) {
                dependentObj.default = false;
            }
            dependent.push(dependentObj);
            foundUser.save(function (err, user) {
                if (err) {
                    console.logE(err);
                    ctrlUtility.sendJSONresponse(res, 503, { 'status': 'error', 'message': 'Service Unavailable' });
                    return;
                }
                console.logD('dependent added');
                ctrlUtility.sendJSONresponse(res, 200, {
                    'status': 'success',
                    'message': 'dependent added successfully',
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

module.exports.updateDependent = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            'success': 'false',
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        const dependentObj = req.body.dependentObj;
        const callbackUserFound = function (foundUser) {
            const dependent = foundUser.dependent;
            const newDependentArray = [];
            for (let i = 0; i < dependent.length; i++) {
                if (dependent[i].id.toString() === dependentObj.id.toString()) {
                    if (dependentObj.default) { // set false for all except the current addresObj
                        console.logD('Making default dependent to dependent-id ', dependentObj.id);
                    }                    
                    newDependentArray.push(dependentObj);
                } else{
                    if (dependentObj.default) { // set false for all except the current addresObj
                        dependent[i].default = false;
                    }
                    newDependentArray.push(dependent[i]);
                }
            }
            foundUser.dependent = newDependentArray;
            foundUser.save(function (err, user) {
                if (err) {
                    console.logE(err);
                    ctrlUtility.sendJSONresponse(res, 503, { 'status': 'error', 'message': 'Service Unavailable' });
                    return;
                }
                console.logD('dependent updated');
                ctrlUtility.sendJSONresponse(res, 200, {
                    'status': 'success',
                    'message': 'Dependent updated successfully'
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

module.exports.deleteDependent = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            'success': 'false',
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        const id = req.params.id;
        const callbackUserFound = function (foundUser) {
            let flag = false;
            const dependent = foundUser.dependent;
            console.logD('deleting passed id->', id);
            for(let i = 0; i < dependent.length; i++) { // id may not be in order so iterate full
                if (dependent[i].id.toString() === id.toString()) {
                    dependent.splice(i, 1);
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
                console.logD('dependent deleted');
                    ctrlUtility.sendJSONresponse(res, 200, {
                        'status': 'success',
                        'message': 'dependent deleted successfully',
                        'totaldependent': dependent.length
                    });
                } else {
                    ctrlUtility.sendJSONresponse(res, 203, {
                        'status': 'error',
                        'message': 'dependent id does not exist',
                        'totalDependent': dependent.length
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
