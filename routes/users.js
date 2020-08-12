const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');

router.get('/register',forwardAuthenticated, (req,res) => res.render('register'));
router.get('/login',forwardAuthenticated, (req,res) => res.render('login'));

router.post('/register', (req,res) => {
    const  {
        name,
        email,
        password,
        password2 } = req.body;

        let errors = [];

        if(!name || !email || !password || !password2)
            errors.push({ msg: 'please fill in all fields'});
        
        if(password.length < 8)
            errors.push({ msg: 'Password must be 8 or more characters long'});
        
        if(password !== password2)
            errors.push({ msg: 'Passwords do not match'});

        //incase of errors rerender the register form with values

        if(errors.length > 0)
        {
            res.render('register.ejs', {
                errors,
                name,
                email,
                password,
                password2
            });
        }
        else{
                User.findOne({email: email})
                    .then(user =>{
                        if(user){
                            errors.push({ msg: 'email is already registered'});
                            res.render('register',{
                                errors,
                                name,
                                email,
                                password,
                                password2
                            });
                        }else {
                         const newUser = new User({
                            name,
                            email, 
                            password
                         });
                         bcrypt.genSalt(10,(err,salt) =>
                           bcrypt.hash(newUser.password,salt, (err,hash) =>{
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered');
                                    res.redirect('/users/login');
                                })
                                .catch(err =>console.log(err));
                         }))

                        }
                    });
            }
});

router.post('/login',(req,res,next)=>{
 passport.authenticate('local',{
    successRedirect:'/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
 })(req, res, next);
});

//logout handle
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;