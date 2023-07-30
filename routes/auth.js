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
    .post(async (req, res, next) => {
        
        
            try {
                let user = new User();
                user.name = req.body.name;
                user.email = req.body.email;
                user.setPassword(req.body.password);
                await user.save(); // Use await with the save() method
                console.log("successfully registered");
                res.redirect("/login");
            } catch (error) {
                console.log(error)
                res.render("register", {
                    errorMessages: error,
                });
            }
        }
    )
    .get(function (req, res, next) {
        res.render("register", {
            title: "register",
        });
    });

module.exports = router;
