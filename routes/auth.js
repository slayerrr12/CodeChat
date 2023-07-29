const passport = require('../passport');
const express = require('express');
const router = express.Router();

router.get('/login', function (req, res, next) {
    res.render('login', {
        title: 'login'
    })
})


router.route('/register').post(function (req, res, next) {

    req.checkBody('name', 'Empty Name').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('password', 'Empty Name').notEmpty();
    req.checkBody('password', 'Password do not match').equals(req.body.confirmPassword).notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        req.render('register', {
            name: req.body.name,
            email: req.body.email,
            errorMessages: errors
        })
    }
    else{
        let user = new User();
        user.name = req.body.name
        user.email = req.body.email;
        user.setPassword(req.body.passport)
        user.save(function(err){
            if (err) {
                res.render('register',{
                    errorMessages:err
                })
                
            }
            else{
                res.redirect('/login')
            }
        })

    }

}).get('/register', function (req, res, next) {
    res.render('register', {
        title: 'register'
    })
})