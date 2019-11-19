var express = require('express');
var router = express.Router();
const userModel = require('../models/user');
const directoryModel = require('../models/directory');
const directoryNameModel = require('../models/directoryName');

//유저 최상위 디렉토리 출력
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

//유저 디렉토리 호출
router.post('/:display_name/:dir_id',function(req,res){
    directoryModel.find({dir_id:req.params.dir_id},{_id:0,dir_tree:1},function (err,dir_tree) {
        if(err) return res.status(500).json({error:err});
        if(!dir_tree){
            return res.send('not exist directory');
            //link 호출
        }
        directoryNameModel.find({dir_id : {$in : dir_tree[0].dir_tree}},function(err,directoryNameModel){
            return res.json(directoryNameModel);
        })
    })
});

//디렉토리 수정
router.post('/:display_name/:dir_id/update',function(req,res){
    directoryNameModel.findOne(req.body.dir_id, function(err, directoryNameModel){
        if(err) res.status(500).json({error:err});
        if(!directoryNameModel){
            return res.send('directory not found');
        }
        if(req.body.name) directoryNameModel.name = req.body.name;

        directoryNameModel.save(function(err){
            if(err) res.status(500).json({error: 'failed to update'});
            res.json({message:'directory updated'});
        });
    });
});

//디렉토리 삭제
router.get('/:display_name/:dir_id/delete',function(req,res){
    directoryModel.deleteOne({dir_id:req.params.dir_id}, function(err){
        if(err) {
            console.log(err);
            return res.send('delete fail');
        }else{
            directoryNameModel.deleteOne({dir_id:req.params.dir_id}, function(err){
                if(err) {
                    console.log(err);
                    return res.send('delete fail');
                }
            })
            return res.send('delete done');
        }
    })
});

module.exports = router;

