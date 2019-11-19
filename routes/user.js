var express = require('express');
var router = express.Router();
const userModel = require('../models/user');

router.get('/:user_email', function(req,res){
    userModel.findOne({email:req.params.user_email}, function(err, email){
        if(err) return res.status(500).json({error:err});
        if(!email) return res.status(404).json({code : 0});
        res.json({code : 1});
    })
});
// router.get('/', (req,res)=>{
//     res.send("hello world");
// });
//
module.exports = router;
