const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findOne({ _id: id })
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            done(err, null);
        });
});

passport.use(
    new LocalStrategy(
        {
            usernameField: "email", // by default it is "username" but we want to use "email"
        },
        async function (username, password, done) {
            try {
                const foundUser = await User.findOne({ email: username });

                if (!foundUser) {
                    return done(null, false, {
                        message: "incorrect username or password",
                    });
                }

                if (!foundUser.validPassword(password)) {
                    return done(null, false, {
                        message: "Incorrect password",
                    });
                }

                return done(null, foundUser);
            } catch (err) {
                return done(err);
            }
        }
    )
);

module.exports = passport;
