const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path')
const app = express();


app.use(express.static(path.join(__dirname, "/public")));
require('./config/passport')(passport);

const PORT = process.env.PORT || 3000;

const db = require('./config/keys.js').MongoURI;

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

app.listen(PORT,console.log(`Running on PORT ${PORT}`));
