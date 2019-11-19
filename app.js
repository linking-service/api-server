// [LOAD PACKAGES]
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');


var mongoose = require('mongoose');

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


//model 정의
//var link = require('./models/link');
var user = require('./models/user');
var name = require('./models/name');
//var directory = require('./models/directory');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// [CONFIGURE SERVER PORT]
var port = 1024;

// [CONFIGURE ROUTER]
var router = require('./routes')(app,user);

// [RUN SERVER]
var server = app.listen(port, function(){
    console.log("Express server has started on port " + port)
});
