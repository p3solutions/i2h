
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
module.exports.getWholeObjFromArrayByVal = function (myArray, ObjKey, val) {
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

module.exports.sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};
