const logger = require('../config/logger');

// set array-obj val into the key
module.exports.updateArrayOfObj = function(myArray, key, val) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i][key] === key) {
            myArray[i][key] = val;
            logger.debug(`${key} updated with ${val}`);
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
            logger.debug(`found key:${ObjKey} , val:${val}`);
            break;
        }
    }
    return flag;
};
// if found return the obj, else returns null
module.exports.getWholeObjFromArrayByVal = function (myArray, ObjKey, val) {
    let item = null;
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i][ObjKey] === val) {
            item = myArray[i];
            logger.debug(`found obj in getWholeObjFromArrayByVal(): ${JSON.stringify(item)}`);
            break;
        }
    }
    return item;
};

module.exports.sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};
