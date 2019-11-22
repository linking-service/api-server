var express = require('express');
var router = express.Router();
const userModel = require('../models/user');

router.post('/', function(req,res){
    userModel.findOne({email:req.body.email}, function(err, email){
        if(err) return res.status(500).json({error:err});
        //등록되지 않은 user 등록
        if(!email){
            var user = new userModel(
                {   
                    email : req.body.email,
                    name : req.body.name,
                    display_name : req.body.name,
                });

            user.save(function (err) {
                if(err) return console.log(err);
                console.log('user information saved!');
              });

            return res.status(404).json({code : 0});
        }
        res.json({code : 1});
    })
});

module.exports = router;
