const passport = require("../passport");
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

router.get("/login", function (req, res, next) {
    res.render("login", {
        title: "login",
    });
});

router
    .route("/register")
    .post(
        [
            body("name").notEmpty().withMessage("Empty Name"),
            body("email").isEmail().withMessage("Invalid Email"),
            body("password").notEmpty().withMessage("Empty Password"),
            body("confirmPassword")
                .notEmpty()
                .withMessage("Empty Confirmation Password")
                .custom((value, { req }) => value === req.body.password)
                .withMessage("Passwords do not match"),
        ],
        async (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.render("register", {
                    name: req.body.name,
                    email: req.body.email,
                    errorMessages: errors,
                });
            } else {
                try {
                    let user = new User();
                    user.name = req.body.name;
                    user.email = req.body.email;
                    user.setPassword(req.body.password);
                    await user.save(); // Use await with the save() method
                    console.log("successfully registered")
                    res.redirect("/login");
                } catch (error) {
                    res.render("register", {
                        errorMessages: error,
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

module.exports = router;
