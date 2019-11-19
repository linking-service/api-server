// [LOAD PACKAGES]
const express = require('express');
const app = express();
var bodyParser  = require('body-parser');
var mongoose = require('mongoose');
//
var path = require('path');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log("connected to mogodb server");
});

mongoose.connect('mongodb://admin:linking13579@106.10.43.34:27017/admin', {useNewUrlParser: true,useUnifiedTopology: true, dbName: 'linking'},
    (error) =>{
    if(error){
        console.log('몽고디비 연결 에러',error);
    } else{
        console.log('몽고디비 연결 성공');
    }
});

app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type")
    next()
})

//model 정의
//var link = require('./models/link');
var user = require('./models/user');
var name = require('./models/name');
//var directory = require('./models/directory');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


// [CONFIGURE SERVER PORT]
var port = 1024;

// [CONFIGURE ROUTER]
// const directoryRouter = require('./routes/directory');
const userRouter = require('./routes/user');
// const linkRouter = require('./routes/link');
// const loginRouter = require('./routes/login');
// const followingRouter = require('./routes/follower');
// const followerRouter = require('./routes/follower');
// const searchRouter = require('./routes/search');
// const indexRouter = require('./routes/index');


// app.use('/',indexRouter);
app.use('/user',userRouter);
// app.use('/link',linkRouter);
// app.use('/login',loginRouter);
// app.use('/following',followingRouter);
// app.use('/follower',followerRouter);
// app.use('/search',searchRouter);
// app.use('/directory',directoryRouter);


// var router = require('./routes')(app,user);

// [RUN SERVER]
var server = app.listen(port, function(){
    console.log("Express server has started on port " + port)
});

module.exports = app;