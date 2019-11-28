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
        directoryNameModel.find({dir_id : {$in : entry_dir_id[0].entry_dir_id}},{_id:0,dir_id: 1,name:1,type:1},function(err,directoryNameModel){
            return res.json(directoryNameModel);
        })
    })
});

//유저 디렉토리 호출
router.post('/:display_name/:dir_id',function(req,res) {
    directoryModel.find({dir_id: req.params.dir_id}, {_id: 0, dir_tree: 1}, function (err, dir_tree) {
        if (err) return res.status(500).json({error: err});
        if (!dir_tree) {
            return res.send('not exist directory');
            //link 호출
        }
        // return res.json(dir_tree);
        directoryNameModel.find({dir_id: {$in: dir_tree[0].dir_tree}},{_id:0,dir_id:1,name:1,type:1}, function (err, directoryNameModel) {
            if(directoryNameModel.length){
                return res.json(directoryNameModel);
            }return res.send('result is null');
        })
    })
});

//디렉토리 수정
router.post('/:display_name/:dir_id/update',function(req,res){
    directoryNameModel.findOne({dir_id: req.params.dir_id}, function(err, directoryNameModel){
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

//디렉토리 추가
router.post('/:display_name/:dir_id/add', async (req, res, next) => {
    const named = req.body.name;
    var dirId = req.params.dir_id;
    var displayName = req.params.display_name;

    const directoryName = new directoryNameModel({
        name: named,
    });
    try {
        await directoryName.save();
        console.log('Add directory');
    } catch (err) {
        console.log('save error');
        console.log(err);
    }

    //저장된 디렉토리 이름 호출 후 array에 저장
    directoryNameModel.find({name: named}, {_id: 0, dir_id: 1}, function (err, dir_id) {
        if (err) return res.status(500).json({error: err});
        if (!dir_id) {
            return res.send('not exist user');
        }
        var jsonID = JSON.stringify(dir_id[0]);

            var directory = new directoryModel({
                dir_id: JSON.parse(jsonID).dir_id,
                user_id: req.params.display_name,
            });
            directory.save(function (err) {
                if (err) return console.log(err);
            });

        //dir_id === 0 이면 최상위 디렉토리, user entry_dir_id에 생성된 디렉토리 id 추가
        if (dirId == 0) {
            //display_name과 일치하는 디렉토리 배열 user entry_dir_id에 update
            userModel.find({display_name: displayName}, {_id: 0, entry_dir_id: 1}, function (err, entry_dir_id) {
                if (err) return res.status(500).json({error: err});
                if (!entry_dir_id) {
                    return res.send('not exist user');
                }
                console.log(entry_dir_id[0]);
                userModel.updateOne({display_name :displayName}, {$push: {entry_dir_id: JSON.parse(jsonID).dir_id}},function(err, result){
                    if(err) console.log(err);
                    console.log('entry saved');
                    console.log(result)
                })
            return res.send("entry_dir_id saved");
            })
        }
        //유저 하위 디렉토리에 새로운 디렉토리 추가 => 해당 디렉토리의 dir_tree에 생성된 디렉토리 id 추가
        else{
            directoryModel.updateOne({dir_id :dirId}, {$push:{dir_tree : JSON.parse(jsonID).dir_id}},function(err, result){
                if(err) console.log(err);
                console.log('dir_tree');
                console.log(result)
            })
            return res.send("dir_tree saved");
        }
    });
});

// TODO 디렉토리 공유
/*
[공유]
유저가 디렉토리 공유 버튼 클릭시 해당 디렉토리 shared 배열에 공유대상의 display_name 저장
유저에게는 private 상태로 유지
공유 대상자들 즉 shared 배열에 있는 유저들에게는 shared 카테고리에 뿌려줌
->공유대상자가 shared 카테고리를 클릭하면 디렉토리 shared에서 display_name이 있는거 다 뿌려줌
또한 dir_id를 통해 디렉토리 이름과 링크또한 출력

//TODO 디렉토리 접근 권한 변경
private, public 카테고리는 유저의 설정을 통해서만 변경해 뿌려줌(공유와 무관)
public 변경시 유저의 directoryName의 type은 public 상태인 1로 변경
 */
module.exports = router;

