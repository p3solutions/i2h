var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');


passport.use(new LocalStrategy({
    usernameField: 'email'
},
    function (username, password, done) {
        console.log('psprt use fn');
        
        User.findOne({ email: username }, function (err, user) {
            console.log('findOne fn');
            if (err) { return done(err); }
            // Return if user not found in database
            if (!user) {
                return done(null, false, {
                    message: 'User not found'
                });
            }
            console.log('found user in psprt->', user.email);            
            // Return if password is wrong
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Password is wrong'
                });
            }
            console.log('success, returning user->', user.email);            
            // If credentials are correct, return the user object
            return done(null, user);
        });
    }
));
