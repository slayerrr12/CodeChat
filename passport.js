const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findOne({ _id: id }, function (err, user) {
        done(err, user);
    });
});

passport.use(
    new LocalStrategy(
        {
            usernameField: "email", // by default it is "username" but we want to use "email"
        },
        function (username, password, done) {
            User.findOne(
                {
                    email: username,
                },
                function (err, foundUser) {
                    // Changed 'done' to 'foundUser'
                    if (err) return done(err);
                    if (!foundUser) {
                        // Changed 'user' to 'foundUser'
                        return done(null, false, {
                            message: "incorrect username or password",
                        });
                    }
                    if (!foundUser.validPassword(password)) {
                        // Changed 'user' to 'foundUser'
                        return done(null, false, {
                            message: "Incorrect password",
                        });
                    }
                    return done(null, foundUser); // Changed 'user' to 'foundUser'
                }
            );
        }
    )
);

module.exports = passport;
