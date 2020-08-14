const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true
    },
    filePath:{
        type:String,
        required:true
    },
    createdBy:{
        type: String,
        required: true
    }
});

const post = mongoose.model('post', postSchema);

module.exports = post;