const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/chats/:id', (req, res) => {
    User.findById(req.params.id).then (loggedUser =>{
        User.find().then (users => {
            const filteredUsers = users.filter(user =>{
                return user._id.toString() !== loggedUser.id.toString();
            });
            const sendUser = {id : loggedUser._id, name: loggedUser.name};
            let usersList = [];
            filteredUsers.forEach(user => {
                usersList.push({id: user._id ,name: user.name})
            })
            res.render('chats.ejs', {
                sendUser,
                usersList
            })
        }).catch( err => {
            console.log(err);
        })
    }).catch( err =>{
        console.log(err);
    })
});

router.post('/chats', (req,res)=>{
    res.send('success');
});

module.exports = router;