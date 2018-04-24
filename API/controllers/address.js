const ctrlUtility = require('./utility');

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
