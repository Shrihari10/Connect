const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path')
const app = express();
const ejs = require('ejs')
const multer = require('multer');
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const db = require('./config/keys.js').MongoURI;
// Public folder
app.use(express.static(path.join(__dirname, "/public")));

require('./config/passport')(passport);

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

mongoose.connect(db, { 
    authSource: 'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


//middleware EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded( {
    extended : false
}));

//session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use("/", require("./routes/index.js"));
app.use("/users", require("./routes/users.js"));

app.post('/upload', function(req, res) {
    upload(req, res, (err) =>{
        if(err) {
            console.log('1');
            res.render('views/dashboard.ejs', { msg: err});
            
        } else {
            if( req.file == undefined){
                console.log('2');
                res.render('views/dashboard.ejs' , { msg: "error: no file selected"});
               
            }
            else{
                console.log('3');
                res.render('views/dashboard.ejs', {
                    msg: 'file uploaded',
                    file: `./Public/uploads/${req.file.filename}`
                });
                
            }
        }
    });
});

app.listen(PORT,console.log(`Running on PORT ${PORT}`));
