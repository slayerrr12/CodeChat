const passport = require('../passport');
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator')

router.get('/login', function (req, res, next) {
    res.render('login', {
        title: 'login'
    })
})


router.route('/register').post(
    [
        body('name').notEmpty().withMessage('Empty Name'),
        body('email').isEmail().withMessage('Invalid Email'),
        body('password').notEmpty().withMessage('Empty Password'),
        body('confirmPassword')
            .notEmpty().withMessage('Empty Confirmation Password')
            .custom((value, { req }) => value === req.body.password)
            .withMessage('Passwords do not match')
    ]
    ,
    function (req, res, next) {



        const errors = validationResult(req);
        if (errors) {
            req.render('register', {
                name: req.body.name,
                email: req.body.email,
                errorMessages: errors
            })
        }
        else {
            let user = new User();
            user.name = req.body.name
            user.email = req.body.email;
            user.setPassword(req.body.passport)
            user.save(function (err) {
                if (err) {
                    res.render('register', {
                        errorMessages: err
                    })

                }
                else {
                    res.redirect('/login')
                }
            })

        }

    }).get('/register', function (req, res, next) {
        res.render('register', {
            title: 'register'
        })
    })