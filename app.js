// [LOAD PACKAGES]
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser  = require('body-parser');

var mongoose = require('mongoose');
var path = require('path');
var autoIncrement =require('mongoose-auto-increment');


app.use(bodyParser.json());

// CORS 설정
app.use(cors()); // 모든 도메인 Request 활성화
// var whiteList = ['http://localhost:3001', 'http://localhost:3002'];
// var corsOptions ={
//     origin : function(origin, callback) {
//         var isWhiteListed = whiteList.indexOf(origin) !== -1;
//         callback(null, isWhiteListed);
//     },
//     credentials: true,
// };
// app.use(cors(corsOptions));

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
var connect = mongoose.createConnection('mongodb://admin:linking13579@106.10.43.34:27017/admin', {useNewUrlParser: true,useUnifiedTopology: true, dbName: 'linking'});
autoIncrement.initialize(connect);

app.get('/', (req,res)=>{
    res.send("Welcome Linking Service");
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(require('connect-history-api-fallback')())

// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json())

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json());
//
// app.use(function(req, res, next) {
//     next(createError(404));
// });

// [CONFIGURE SERVER PORT]
const port = 1024;

// [CONFIGURE ROUTER]
const directoryRouter = require('./routes/directory');
const userRouter = require('./routes/user');
const linkRouter = require('./routes/link');
const followingRouter = require('./routes/following');
const followerRouter = require('./routes/follower');
const searchRouter = require('./routes/search');
const mailRouter = require('./routes/mail');
// const indexRouter = require('./routes/index');


// app.use('/',indexRouter);
app.use('/user',userRouter);
app.use('/link',linkRouter);
app.use('/following',followingRouter);
app.use('/follower',followerRouter);
app.use('/search',searchRouter);
app.use('/directory',directoryRouter);
app.use('/mail',mailRouter);


// [RUN SERVER]
const server = app.listen(port, function(){
    console.log("Express server has started on port " + port)
});

module.exports = app;