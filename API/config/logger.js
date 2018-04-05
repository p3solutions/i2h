/*
Author: Shammi Hans
Dependency: JavaScript (ES6) 
Description: Overriding console.log to log current time along with passed logs
   __
  / /  ___   __ _  __ _  ___ _ __
 / /  / _ \ / _` |/ _` |/ _ \ '__|
/ /__| (_) | (_| | (_| |  __/ |
\____/\___/ \__, |\__, |\___|_|
             __| | __| |                                  
            |___/ |___/

================================ HOW TO USE ================================
console.log('Original logging');     // [2018-4-5 16:43:23] Original logging
console.logI('info format');         // [2018-4-5 16:43:23] INFO info format
console.logD('debug fromat');        // [2018-4-5 16:43:23] DEBUG debug fromat
console.logE('Error format');        // [2018-4-5 16:43:23] ERROR Error format

*/

var origlog = console.log;

console.log = function (obj, ...placeholders) {
    var dateString = new Date().toLocaleString();
    if (typeof obj === 'string')
        placeholders.unshift(`[${dateString}] ${obj}`);
    else {
        // This handles console.log( object )
        placeholders.unshift(obj);
        placeholders.unshift(`[${dateString}] %j`);
    }
    origlog.apply(this, placeholders);
};

console.logD = function (obj, ...placeholders) {
    var dateString = new Date().toLocaleString();
    if (typeof obj === 'string')
        placeholders.unshift(`[${dateString}] DEBUG ${obj}`);
    else {
        // This handles console.log( object )
        placeholders.unshift(obj);
        placeholders.unshift(`[${dateString}] DEBUG %j`);
    }
    origlog.apply(this, placeholders);
};

console.logI = function (obj, ...placeholders) {
    var dateString = new Date().toLocaleString();
    if (typeof obj === 'string')
        placeholders.unshift(`[${dateString}] INFO ${obj}`);
    else {
        // This handles console.log( object )
        placeholders.unshift(obj);
        placeholders.unshift(`[${dateString}] INFO %j`);
    }
    origlog.apply(this, placeholders);
};

console.logE = function (obj, ...placeholders) {
    var dateString = new Date().toLocaleString();
    if (typeof obj === 'string')
        placeholders.unshift(`[${dateString}] ERROR ${obj}`);
    else {
        // This handles console.log( object )
        placeholders.unshift(obj);
        placeholders.unshift(`[${dateString}] ERROR %j`);
    }
    origlog.apply(this, placeholders);
};
