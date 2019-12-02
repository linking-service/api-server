var express = require('express');
var router = express.Router();
const userModel = require('../models/user');
const directoryModel = require('../models/directory');
const directoryNameModel = require('../models/directoryName');

//유저 최상위 public 디렉토리 출력

router.post('/:display_name/public',function(req,res){
    userModel.find({display_name:req.params.display_name},{_id:0,entry_dir_id: 1},function (err, entry_dir_id){
        if(err) return res.status(500).json({error:err});
        if(!entry_dir_id){
            return res.send('not exist user');
        }
        directoryNameModel.find({dir_id : {$in : entry_dir_id[0].entry_dir_id},dir_type:1},{_id:0,dir_id: 1,name:1,dir_type:1},function(err,directoryNameModel){
            return res.json(directoryNameModel);
        })
    })
});

//유저 최상위 private 디렉토리 출력

router.post('/:display_name/private',function(req,res){
    userModel.find({display_name:req.params.display_name},{_id:0,entry_dir_id: 1},function (err, entry_dir_id){
        if(err) return res.status(500).json({error:err});
        if(!entry_dir_id){
            return res.send('not exist user');
        }
        directoryNameModel.find({dir_id : {$in : entry_dir_id[0].entry_dir_id},dir_type:0},{_id:0,dir_id: 1,name:1,dir_type:1},function(err,directoryNameModel){
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
    var displayName = req.params.display_name;
    var dirID = req.params.dir_id;
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
                else{
                   userModel.find({display_name : displayName, entry_dir_id:{$in:dirID} },{
                           _id:0,
                           entry_dir_id:1
                       }, function(err, entry_dir_id){
                           if(entry_dir_id.length == 1){
                               userModel.updateOne({display_name :displayName},{$pull:{entry_dir_id:dirID}},function (err){
                                   if(err) console.log(err);
                               })
                               console.log("entry_dir_id deleted");
                           }
                       else{
                           directoryModel.updateOne({user_id :displayName},{$pull:{dir_tree:dirID}},function (err){
                               if(err) console.log(err);
                           })
                           console.log("dir_tree deleted");
                       }
                   })
                }
            });
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

// 디렉토리 공유
/*
[공유]
유저가 디렉토리 공유 버튼 클릭시 해당 디렉토리 shared 배열에 공유대상의 display_name 저장
유저에게는 private 상태로 유지
공유 대상자들 즉 shared 배열에 있는 유저들에게는 shared 카테고리에 뿌려줌
->공유대상자가 shared 카테고리를 클릭하면 디렉토리 shared에서 display_name이 있는거 다 뿌려줌
또한 dir_id를 통해 디렉토리 이름과 링크또한 출력
 */
router.post("/:dir_id/:display_name/share", async(req,res)=> {
    var displayName = req.params.display_name;

    directoryModel.find({shared: displayName, dir_id: req.params.dir_id}, {_id: 0, shared: 1}, function (err, shared) {
        if (err) console.log(err);
        if (shared.length == 1) {
            console.log(shared[0].shared);
            return res.send("this user already shared");
        }
        else {
            directoryModel.updateOne({dir_id: req.params.dir_id}, {$push: {shared: displayName}}, function (err) {
                if (err) console.log(err);
                res.send("share to user")
            })
        }
    })
})



//shared 카테고리 출력
router.post("/:display_name/show/shared", async (req, res) => {
    let dir_id = null;
    try {
        dir_id = await directoryModel.find({
            shared: req.params.display_name
        }, {
            _id: 0,
            dir_id: 1
        });
    } catch (e) {
        console.log(err); // 마지막 dir_id 못찾으면 에러 반환
        return res.send('Cannot find latest dir_id')
        //res.status(500).json({
            //msg: "Cannot find latest dir_id",
        //});
    }

    let resultArray = [];
    for (let i = 0; i < dir_id.length; i++) {
        let result = null;
        try {
            result = await directoryNameModel.find({
                dir_id: dir_id[i].dir_id
            }, {
                _id: 0,
                dir_id: 1,
                name: 1
            });
        } catch (err) {
            console.log(err); // 중간에 빈 dir_id가 있을 경우 그냥 continue 시켜주시면 됩니다.
            continue;
        }
        resultArray.push(result[0]);
    } //for문 끝
    if(resultArray.length == 0) return res.send("cannot find shared directory");
    else{return res.json(resultArray);}
});




/*디렉토리 접근 권한 변경
private, public 카테고리는 유저의 설정을 통해서만 변경해 뿌려줌(공유와 무관)
public 변경시 유저의 directoryName의 type은 public 상태인 1로 변경
 */
router.post("/:dir_id/:name/change", async(req, res)=>{
    await directoryNameModel.find({dir_id: req.params.dir_id},{
        _id : 0,dir_type: 1
    }, function(err, dir_type){
        console.log(dir_type);
        const type = dir_type[0].dir_type;
        if(type ==0){
            directoryNameModel.findOneAndUpdate({dir_id:req.params.dir_id},{
                dir_type :1
            },function (err){
                if(err) console.log(err);})
        }
        else{
            directoryNameModel.findOneAndUpdate({dir_id:req.params.dir_id},{
                dir_type :0
            },function (err){
                if(err) console.log(err);
            })
        }
        if(err) console.log(err)
    });
    return res.send("directory type changed!!");
});

module.exports = router;