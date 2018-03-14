var configs = {};
configs.apiPort = 3000;
configs.dbPort = 27017;
configs.dbHost = '127.0.0.1';
configs.dbName = 'i2h-api';
configs.dbConnectionUrl = 'mongodb://' + configs.dbHost + '/' + configs.dbName;
configs.logDirectory = `${__dirname}\\log`;
configs.logFile = 'access.log';
// configs.resetPwdUrl = `${configs.url}4200/password-reset`;
// configs.forgotPwdUrl = `${configs.url}4200/forgot-password`;
// configs.showLinkError = '?error=true'; // 'Invalid reset link'
// configs.pwdResetUrl = '/pwd-reset';
// configs.validateLinkUrl = 'http://13.58.89.64:9000/auth/key-validity?';

module.exports = configs;