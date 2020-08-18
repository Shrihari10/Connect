const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path')
const app = express();
const ejs = require('ejs');
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require('./utils/msg');

app.use(bodyParser.json());

const db = require('./config/keys.js').MongoURI;
// Public folder
app.use(express.static(path.join(__dirname, "Public")));
app.use(express.static(path.join(__dirname, "Public/uploads")));

require('./config/passport')(passport);

app.use( require("./routes/posts.js"));

mongoose.connect(db, { 
    authSource: 'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


//middleware EJS
app.use(expressLayouts);
app.set('views', path.join(__dirname, "./template/views"));
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

app.use("/", require("./routes/chat.js"));

io.on('connection', socket =>{
    console.log('new WS connection');
    socket.emit('message', formatMessage('Admin','welcome to chats'));

    socket.broadcast.emit('message', formatMessage('Admin','A user has connected'));
    
    socket.on('disconnect', ()=> {
    io.emit('message', formatMessage('Admin','A user has left the chat'));
    });
    
    socket.on('chatMessage', (data)=> {
        io.emit('message',formatMessage(data.userName, data.msg));
    });
});


server.listen(PORT,console.log(`Running on PORT ${PORT}`));
