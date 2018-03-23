let configs = {};
// used in server.js
configs.apiPort = 3000;
configs.dbPort = 27017;
configs.dbHost = '127.0.0.1';
configs.dbName = 'i2h-api';
configs.dbConnectionUrl = 'mongodb://' + configs.dbHost + '/' + configs.dbName;
configs.logDirectory = `${__dirname}\\..\\log`;
configs.logFile = 'access.log';
configs.IPallowedForUI = 'http://localhost:4200';
// used in login.js
configs.OTPdigits = 6;
configs.OTPdeletionTime = (1000 * 60) * 5; // 5 minutes

module.exports = configs;