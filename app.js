const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const mongoose = require("mongoose");
const passport = require("passport");
const config = require("./config");
const session = require("express-session");

require("./passport");

mongoose
  .connect(config.dbConnectSting, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

global.user = require("./models/user");
global.Task = require('./models/task');

const app = express();

// view engi ne setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: config.sessionKey,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use('/', taskRoutes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
