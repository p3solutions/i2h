/**
 * References - https://www.npmjs.com/package/express-mailer
 * 
 */
const nodemailer = require('nodemailer');
const configs = require('../config/config');

const mailerOptions = {
    from: 'shammi.hans@platform3solutions.com', // 'no-reply@example.com',
    to: 'shammihans1@gmail.com',
    subject: 'Confidential OTP for login at I2H.',
    template: 'email', // it is not working
    html: '<b>This email is from I2H</b>'
};

module.exports.getmailerOptions = function (params) {
    mailerOptions.host = params.host || mailerOptions.host;
    mailerOptions.secureConnection = params.secureConnection || mailerOptions.secureConnection;
    mailerOptions.port = params.port || mailerOptions.port;
    mailerOptions.transportMethod = params.transportMethod || mailerOptions.transportMethod;
    mailerOptions.auth = params.auth || mailerOptions.auth;
    mailerOptions.html = params.html || mailerOptions.html;
    mailerOptions.template = params.template || mailerOptions.template;
    mailerOptions.from = params.from || mailerOptions.from;
    mailerOptions.to = params.to || mailerOptions.to;
    mailerOptions.cc = params.cc || mailerOptions.cc;
    mailerOptions.bcc = params.bcc || mailerOptions.bcc;
    mailerOptions.replyTo = params.replyTo || mailerOptions.replyTo;
    mailerOptions.inReplyTo = params.inReplyTo || mailerOptions.inReplyTo;
    mailerOptions.subject = params.subject || mailerOptions.subject;
    mailerOptions.headers = params.headers || mailerOptions.headers;
    mailerOptions.attachments = params.attachments || mailerOptions.attachments;
    mailerOptions.references = params.references || mailerOptions.references;
    mailerOptions.alternatives = params.alternatives || mailerOptions.alternatives;
    mailerOptions.envelope = params.envelope || mailerOptions.envelope;
    mailerOptions.date = params.date || mailerOptions.date;
    mailerOptions.encoding = params.encoding || mailerOptions.encoding;
    mailerOptions.charset  = params.charset  || mailerOptions.charset;
    mailerOptions.dsn = params.dsn || mailerOptions.dsn;

    return mailerOptions;
};

module.exports.getTransport = function () {
    return nodemailer.createTransport({
        host: configs.EMAIL_HOST,
        port: configs.EMAIL_PORT,
        secure: false,
        auth: {
            user: configs.EMAIL_HOST_USER,
            pass: configs.EMAIL_HOST_PASSWORD
        }
    });
};
