const fs = require('fs');
const rfs = require('rotating-file-stream');
const configs = {};
// used in server.js
configs.apiPort = 3000;
configs.accessLogStream;
// used in db.js
configs.dbPort = 27017;
configs.dbHost = '127.0.0.1';
configs.dbName = 'i2h-api';
configs.dbConnectionUrl = 'mongodb://' + configs.dbHost + '/' + configs.dbName;
// not used currently
// configs.IPallowedForUI = 'http://localhost:4200';
// used in login.js
configs.OTPdigits = 6;
configs.OTPdeletionTime = (1000 * 60) * 2; // 2 minutes or 1,20,000 ms

// used below
configs.logDirectory = `${__dirname}/../log`;
configs.terminalLogFile = 'terminal.log';
configs.apiAccesslogFile = 'api.access.log';

//
console.log(`All console logs / Terminal logs & API access logs are available here:
            Directory: ${configs.logDirectory}\\
            Files: ${configs.terminalLogFile} & ${configs.apiAccesslogFile} `);

/*
    Ensure log directories/files 
*/

// HTTP request logs / terminal logs
// ensure log directory exists
let dirInfo = '';
if (fs.existsSync(configs.logDirectory))
    dirInfo = `Existing Log folder path:`;
else {
    fs.mkdirSync(configs.logDirectory);
    dirInfo = `Created log file, path:`;
}

// create a rotating write stream
configs.accessLogStream = rfs(configs.apiAccesslogFile, {
    size: '5M', // rotate every 5 MegaBytes written
    interval: '1d', // rotate daily
    // compress: 'gzip', // compress rotated files
    path: configs.logDirectory
});
configs.terminalLogStream = rfs(configs.terminalLogFile, {
    size: '5M', // rotate every 5 MegaBytes written
    interval: '1d', // rotate daily
    // compress: 'gzip', // compress rotated files
    path: configs.logDirectory
});

// Console/terminal logs 
// const access = fs.createWriteStream(configs.consoleLogFilePath); // always create a new file on server start
const access = configs.terminalLogStream;
process.stdout.write = process.stderr.write = access.write.bind(access);

// starting of logging in file
console.log(`\n************************************************************\n************************************************************`);
const currentTime = (new Date()).toLocaleString();
console.log(`Log begins: ${currentTime}`);
console.log(`${dirInfo} ${configs.logDirectory}`);

process.on('uncaughtException', function (err) {
    const error = (err && err.stack) ? err.stack : err;
    // console.error();
    console.log(`${currentTime} ${error}`);
});

module.exports = configs;
