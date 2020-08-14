const express = require('express');
const router = express.Router();
const user = require('../models/User');
const multer = require('multer');
const path = require('path')
const Post = require('../models/post');

//storage engine
const storage = multer.diskStorage({
    destination: './Public/uploads/',
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Upload init
const upload = multer ({
 storage: storage,
 fileFilter: function(req, file, cb){
     checkFileType(file,cb);
 }
}).single('myImage');

function checkFileType(file,cb){
    const filetypes = /jpeg|jpg|png|gif/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if( mimetype && extname){
        return cb(null, true);
        console.log('hi');
    } else {
        cb('err: not image');
    }
}

router.post('/upload/:id', upload,function (req,res) {

  user.findById(req.params.id).then (userData => {
    const post = new Post({
        caption: req.body.caption,
        filePath: `http://localhost:3000/${req.file.filename}`,
        createdBy: userData.name
    })
    post.save().then(postData => {
        res.redirect('/dashboard')
    }).catch ( err =>{
        console.log(err);
    })
  }).catch ( err =>{
    console.log(err);
})
});

module.exports =  router;