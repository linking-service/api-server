var express = require('express');
// var path = require('path');
var router = express.Router();
const user = require('../models/user');

router.get('/user:user_email', function(req,res){
    user.findOne({email:req.params.user_email}, function(err, email){
        if(err) return res.status(500).json({error:err});
        if(!email) return res.status(404).json({code : 0});
        res.json({code : 1});
    })
});
module.exports = router;