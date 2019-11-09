var passport = require('passport');
var LocalStrategy = require('passport-local');

// Initialise a session when user login
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findOne({_id: id}, function (err, user) {
        done(err, user);
    })
});

passport.use(new LocalStrategy({
    // set the unique username
        usernameField: 'email'
    },
    function (username, password, done) {
        User.findOne({email: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username or password'
                });
            }

            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password'
                });
            }

            // If everything is ok, return the username (true value)
            return done(null, user);
        })
    })
);
