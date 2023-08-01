const passport = require("../passport");
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
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
        body("name").notEmpty().withMessage("must not be empty"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("password is short , min length is 6"),
        async (req, res, next) => {
            const Errors = validationResult(req);
            if (!Errors.isEmpty()) {
                console.log(Errors);
                return res.render("register", {
                    errorMessages: Errors.array(),
                });
            } else {
                try {
                    let user = new User();
                    user.name = req.body.name;
                    user.email = req.body.email;
                    user.setPassword(req.body.password);
                    await user.save(); // Use await with the save() method
                    console.log("successfully registered");
                    return res.redirect("/login");
                } catch (error) {
                    console.log(error);
                    return res.render("register", {
                        errorMessages: error.errors,
                    });
                }
            }
        }
    )
    .get(function (req, res, next) {
        res.render("register", {
            title: "register",
        });
    });

router.get("/logout", function (req, res, next) {
    req.logout();
    res.redirect("/");
});

module.exports = router;
