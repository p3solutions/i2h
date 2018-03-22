var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    passwordHash: { type: String, required: true},
    passwordSalt: String,
    created_at: Date,
    updated_at: Date
    // ,
    // dob: String,
    // sex: String,
    // mobile: String
});

module.exports = mongoose.model('User', UserSchema);