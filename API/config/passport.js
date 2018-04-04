var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');


passport.use(new LocalStrategy({
    usernameField: 'email'
},
    function (username, password, done) {
        User.findOne({ email: username }, function (err, user) {
            if (err) { return done(err); }
            // Return if user not found in database
            if (!user) {
                return done(null, false, {
                    message: 'User not found'
                });
            }
            console.log('NOTE: if it throws error just after this line, then it means user is new user login with password, but the user details(password & all are not in DB for->', user.email);
            // Return if password is wrong
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Password is wrong'
                });
            }
            // If credentials are correct, return the user object
            return done(null, user);
        });
    }
));
