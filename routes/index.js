const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const express = require('express');
const router = express.Router();
const user = require('../models/User');
const Post = require('../models/post');

router.get('/',forwardAuthenticated, (req,res) => res.render('welcome.ejs'));

router.get('/dashboard',ensureAuthenticated, (req, res) => {
    user.findOne({ email: req.user.email }).then (user => {
        Post.find().then( posts =>{
            res.render('dashboard.ejs', {
                name: user.name,
                id: user._id,
                posts: posts
            })
        }).catch( err => {
            console.log(err);
        })
    }).catch( err =>{
        console.log(err);
    })
   
});

//  router.get('/dashboard/:id',ensureAuthenticated, (req, res) =>{
//  user.findById(req.params.id).then (user => {
//     res.render('dashboard.ejs', {
//         userName: user.name
//     })
//     });
// });

module.exports = router;