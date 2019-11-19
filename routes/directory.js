var express = require('express');
var router = express.Router();
const userModel = require('../models/user');
// const directoryModel = require('../models/directory');
const directoryNameModel = require('../models/directoryName');

router.post('/:display_name',function(req,res){
    userModel.find({display_name:req.params.display_name},{_id:0,entry_dir_id: 1},function (err, entry_dir_id){
        if(err) return res.status(500).json({error:err});
        if(!entry_dir_id){
            return res.send('not exist user');
        }
        directoryNameModel.find({dir_id : {$in : entry_dir_id[0].entry_dir_id}},function(err,directoryNameModel){
            return res.json(directoryNameModel);
        })
        //res.json(entry_dir_id);
        //return console.log("finding name");
    })
});

module.exports = router;

