const passport = require("../passport");
const express = require("express");
const router = express.Router();
const expressValidator = require("express-validator");
const User = require("../models/user");

router
    .route("/login")
    .post(
        passport.authenticate("local", {
            failureRedirect: "/login",
        }),
        function (req, res) {
            res.redirect("/");
        }
    )
    .get(function (req, res, next) {
        res.render("login", {
            title: "login",
        });
    });

router
    .route("/register")
    .post(
        expressValidator.body("name").isLength({ min: 3 }),

        expressValidator.body("password").isLength({ min: 6 }),
        async (req, res, next) => {
            const Errors = expressValidator.validationResult(req);
            if (!Errors.isEmpty()) {
                res.render("register", {
                    errorMessages: Errors.array(),
                });
            }

            try {
                let user = new User();
                user.name = req.body.name;
                user.email = req.body.email;
                user.setPassword(req.body.password);
                await user.save(); // Use await with the save() method
                console.log("successfully registered");
                res.redirect("/login");
            } catch (error) {
                console.log(error);
                res.render("register", {
                    errorMessages: error.errors,
                });
            }
        }
    )
    .get(function (req, res, next) {
        res.render("register", {
            title: "register",
        });
    });


router.get('/logout',function (req, res, next){
    req.logout();
    res.redirect('/')
})

module.exports = router;
