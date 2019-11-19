var express = require('express');
var router = express.Router();
const userModel = require('../models/user');
// const directoryModel = require('../models/directory');
// const directoryNameModel = require('../models/directoryName');

router.post('/:display_name',function(req,res){
    userModel.findOne({display_name:req.body.display_name},function (err, display_name){
        if(err) return res.status(500).json({error:err});
        if(!display_name){
            return res.send('not exist user');
        }
        return res.send('good');
        // userModel.findOne({})
    })
});

module.exports = router;

