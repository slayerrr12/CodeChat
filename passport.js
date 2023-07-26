const passport = require("passport");
const user = require("./models/user");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  user.findOne({ _id: id }, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // by default it is "username" but we want to use
    },
    function (username, password, done) {
      UserActivation.findOne(
        {
          email: username,
        },
        function (err, done) {
          if (err) return done(err);
          if (!user) {
            return done(null, false, {
              message: "incorrect username or password",
            });
          }
          if (!user.validPassword(password)) {
            return done(null, false, {
              message: "Incorrect ",
            });
          }
          return done(null , user);
        }
      );
    }
  )
);
