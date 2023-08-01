// Inside your controller file (e.g., authController.js)

const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const express = require("express");
const router = express.Router();
const User = require("../models/user");

require("dotenv").config();

// GitHub OAuth 2.0 Strategy setup

passport.use(
    new GitHubStrategy(
        {
            // Replace 'YOUR_CLIENT_ID' and 'YOUR_CLIENT_SECRET' with your GitHub OAuth app credentials
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/api/auth/callback/github", // Replace with your callback URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if the user already exists in the database based on the GitHub user's email
                let existingUser = await User.findOne({ email: profile._json.email });

                if (existingUser) {
                    // User already exists, update the GitHub profile details (optional)
                    existingUser.name = profile.displayName || profile.username;
                    // Save the updated user record
                    await existingUser.save();

                    // Pass the user data to the 'done' callback
                    return done(null, existingUser);
                } else {
                    // User doesn't exist, create a new user record
                    let newUser = new User({
                        name: profile.displayName || profile.username,
                        email: profile._json.email,
                    });

                    // Save the new user record to the database
                    await newUser.save();

                    // Pass the user data to the 'done' callback
                    return done(null, newUser);
                }
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

router.get("/", passport.authenticate("github", { scope: { user: email } }));

router.get(
    "/callback",
    passport.authenticate("github ", { failureRedirect: "/auth/github/error" }),
    function (req, res) {
        res.redirect("/auth/github/success");
    }
);

router.get('/success', async (req, res) => {
    const userInfo = {
        id: req.session.passport.user.id,
        displayName: req.session.passport.user.username,
        provider: req.session.passport.user.provider,
    };
     res.render
    }
})