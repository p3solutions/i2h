
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    fname: { type: String, default: null },
    lname: { type: String, default: null },
    dob: { type: String, default: null },
    otpList: { type: [], default: [] },
    address: { type: [], default: [] },
    dependent: {type: [], default: [] },
    sex: { type: String, default: null },
    mobile: { type: String, default: null },
    hash: { type: String, default: null },
    salt: { type: String, default: null },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
});

userSchema.methods.setPassword = function (password) {
    // new Buffer(password, 'binary')
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        // name: this.name,
        exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('User', userSchema);