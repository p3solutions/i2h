/*
Reference: https://www.npmjs.com/package/simple-node-logger
 __ _                 _            __          _          __
/ _(_)_ __ ___  _ __ | | ___    /\ \ \___   __| | ___    / /  ___   __ _  __ _  ___ _ __
\ \| | '_ ` _ \| '_ \| |/ _ \  /  \/ / _ \ / _` |/ _ \  / /  / _ \ / _` |/ _` |/ _ \ '__|
_\ \ | | | | | | |_) | |  __/ / /\  / (_) | (_| |  __/ / /__| (_) | (_| | (_| |  __/ |
\__/_|_| |_| |_| .__/|_|\___| \_\ \/ \___/ \__,_|\___| \____/\___/ \__, |\__, |\___|_|
               |_|                                                 |___/ |___/
*/

const configs = require('./config'),
SimpleNodeLogger = require('simple-node-logger'),
// opts = {
//     errorEventName: 'error',
//     logDirectory: `${configs.logDirectory}`, // NOTE: folder must exist and be writable...
//     fileNamePattern: 'dev.<DATE>.log',
//     dateFormat: 'YYYY.MM.DD'
// },
opts = {
    errorEventName: 'error',
    logDirectory: `${configs.logDirectory}`,
    fileNamePattern: `${configs.terminalLogFile}`
},

log = SimpleNodeLogger.createRollingFileLogger(opts);
// levels: trace, debug, info, warn, error and fatal levels (plus all and off)
log.setLevel('debug'); // by-default 'info' is set
// console.log(log); // to see existing methods available in this logger


module.exports = log;


/* HOW TO LOG FROM ANY FILE:

const logger = require('./config/logger');
logger.debug('Debug statement');
logger.info('Info statement');

*/