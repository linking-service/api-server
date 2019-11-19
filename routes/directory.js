var express = require('express');
var router = express.Router();
const userModel = require('../models/user');
const directoryModel = require('../models/directory');
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

router.post('/:display_name/:dir_id',function(req,res){
    directoryModel.find({dir_id:req.params.dir_id},{_id:0,dir_tree:1},function (err,dir_tree) {
        if(err) return res.status(500).json({error:err});
        if(!dir_tree){
            return res.send('not exist directory');
        }
        directoryNameModel.find({dir_id : {$in : dir_tree[0].dir_tree}},function(err,directoryNameModel){
            return res.json(directoryNameModel);
        })
    })
});

module.exports = router;

