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

// Optional: You can serialize and deserialize the user (required for persistent login sessions)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Controller actions

// Initiate GitHub authentication
exports.authGitHub = passport.authenticate("github");

// GitHub authentication callback
exports.authGitHubCallback = passport.authenticate("github", {
    successRedirect: "/", // Replace with the URL you want to redirect after successful authentication
    failureRedirect: "/login", // Replace with the URL for handling failed authentication
});

// Optional: Logout
exports.logout = (req, res) => {
    req.logout();
    res.redirect("/"); // Redirect to the home page or any other page after logout
};
