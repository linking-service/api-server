var express = require('express');
var router = express.Router();
const userModel = require('../models/user');

//following한 유저 호출
router.post("/:display_name/read", async (req,res)=>{
    let result = null;

    try{
        result = await userModel.find({
            display_name : req.params.display_name
        },{_id:0, following :1,email:1});
        console.log("DB find");
        return await res.json(result);
    } catch(err){
        return res.status(500).json({
            msg: "DB find error"
        });
    }
    if(!result){
        res.status(404).json({
            msg: "cannot find the following id"
        });
        return;
    }
});

//following 유저 삭제
/*
 삭제하는 유저의 follower 목록에서 제거되어야함
 */
router.post("/:display_name/:following/delete" ,async (req, res)=>{
    const displayName = req.params.display_name;
    const followingName = req.params.following;

    await userModel.findOneAndUpdate({display_name: displayName, following: followingName},{
        $pull:{following: followingName}},
        function(err){
        if (err) console.log(err);
    });

    await userModel.findOneAndUpdate({display_name:followingName, follower: displayName},{
        $pull:{follower :displayName}},
        function(err){
        if(err) console.log(err);
    });
    return res.send("following name is deleted!!");
});

//following 목록에 추가
/*
following 목록에 추가시 대상유저의 follower목록에도 추가되어야함
display_name : api 호출하는 유저  following : 목록에 추가하고자 하는 유저
 */
router.post("/:display_name/:following/add", async (req,res)=>{

    userModel.find({display_name: req.params.display_name, following:req.params.following},{_id:0, following:1},
        function(err,following){
        if(err) console.log(err);
        if(following.length ==1){
            console.log(following[0].following);
            return res.send("this user is already added");
        }
        else{
            userModel.findOneAndUpdate({display_name: req.params.display_name},{$push:{following : req.params.following}},
                function (err) {
                    if(err) console.log(err);
                }
            );

            userModel.findOneAndUpdate({display_name:req.params.following},{$push :{follower : req.params.display_name}},
                function(err){
                    if(err) console.log(err);
                });
            return res.send("following user is added");
        }
    })
});

module.exports = router;