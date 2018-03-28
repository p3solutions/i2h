var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');


passport.use(new LocalStrategy({
    usernameField: 'email'
},
    function (username, password, done) {
        User.findOne({ email: username }, function (err, user) {
            console.log(`${user} in passport fn 1`);
            if (err) { return done(err); }
            // Return if user not found in database
            if (!user) {
                console.log(`${user} in passport fn 2`);
                return done(null, false, {
                    message: 'User not found'
                });
            }

            // Return if password is wrong
            if (!user.validPassword(password)) {
                console.log(`${user} in passport fn 3`);
                return done(null, false, {
                    message: 'Password is wrong'
                });
            }
            // If credentials are correct, return the user object
            console.log(`${user} in passport fn 4`);
            return done(null, user);
        });
    }
));
