var express = require("express");
var router = express.Router();
const userModel = require("../models/user");
const linkModel = require("../models/link");
const directoryModel = require("../models/directory");
const _ = require("underscore");

//user 검색
router.get('/:display_name/:keyword',async (req,res)=> {
    const query = req.params.keyword;
    const displayName = req.params.display_name;
    if (!query) {
        return res.json("no keyword");
    }
    let resultarray = null;
    let resultarray2 = null;
    try{
        resultarray = await userModel.find({'display_name' :{$regex : query, $options : 'i'}},{_id:0,display_name:1, name:1}).where("follower").equals(displayName);
        resultarray2 = await userModel.find({'display_name' :{$regex : query, $options : 'i'}},{_id:0,display_name:1, name:1,follower:1}).where("follower").ne(displayName).where("display_name").ne(displayName)

    }catch(err){
        if(err) console.log(err);
    }

    let followingarray = [];
    for( let i =0; i<resultarray.length; i++){
        let result = null;
        let followingStatus = {following_status : 1};
        try{
            result = await userModel.find({
                display_name : resultarray[i].display_name
            },{
                _id:0,
                display_name:1,
                name:1
            }).lean();
        }catch(err){
            console.log(err);
            continue;
        }
        Object.assign(followingStatus, result[0]);
        followingarray.push(followingStatus);
    }

    let nonfollowingarray = [];
    for( let i =0; i<resultarray2.length; i++){
        let result2 = null;
        let followingStatus = {following_status : 0};
        try{
            result2 = await userModel.find({
                display_name : resultarray2[i].display_name
            },{
                _id:0,
                display_name:1,
                name:1
            }).lean();
        }catch(err){
            console.log(err);
            continue;
        }
        Object.assign(followingStatus,result2[0]);
        nonfollowingarray.push(followingStatus);
    }
    let resultArray =[];
    for(var i in followingarray){
        resultArray.push(followingarray[i]);
    }
    for(var j in nonfollowingarray){
        resultArray.push(nonfollowingarray[j]);
    }

   return res.json(resultArray );
});

// 전체 검색
router.get('/:display_name/:keyword/all',async (req,res)=> {
    const query = req.params.keyword;
    const displayName = req.params.display_name;
    if (!query) {
        return res.json("no keyword");
    }
    let metaDescResult = null;
    let metaTitleResult = null;
    let descResult = null;
    let tagResult = null;
    try{
        metaDescResult = await linkModel.find({display_name:displayName,'meta_desc' :{$regex : query, $options : 'i'}},{_id:0, link :1,tag:1,desc:1,meta_desc:1,
            meta_imgUrl: 1,meta_title: 1,read_status: 1,created_time: 1, revised_time: 1, link_id:1, favorite_status:1,display_name:1});
        metaTitleResult = await linkModel.find({display_name:displayName,'meta_title' :{$regex : query, $options : 'i'}},{_id:0, link :1,tag:1,desc:1,meta_desc:1,
            meta_imgUrl: 1,meta_title: 1,read_status: 1,created_time: 1, revised_time: 1, link_id:1, favorite_status:1,display_name:1});
        descResult = await linkModel.find({display_name:displayName,'desc' :{$regex : query, $options : 'i'}},{_id:0, link :1,tag:1,desc:1,meta_desc:1,
            meta_imgUrl: 1,meta_title: 1,read_status: 1,created_time: 1, revised_time: 1, link_id:1, favorite_status:1,display_name:1});
         tagResult = await linkModel.find({display_name:displayName,'tag' :{$regex : query, $options : 'i'}},{_id:0, link :1,tag:1,desc:1,meta_desc:1,
            meta_imgUrl: 1,meta_title: 1,read_status: 1,created_time: 1, revised_time: 1, link_id:1, favorite_status:1,display_name:1});

        var result =_.union(metaTitleResult,descResult,tagResult,metaDescResult);
        var result2 = _.uniq(result,'link');
        return await res.json(result2);

    }catch(err){
        if(err) console.log(err)
    }
});

// // tag 검색
router.get('/:display_name/:keyword/tag',async (req,res)=> {
    const query = req.params.keyword;
    const displayName = req.params.display_name;
    if (!query) {
        return res.json("no keyword");
    }

    let tagResult = null;
    try{
        tagResult = await linkModel.find({display_name:displayName,'tag' :{$regex : query, $options : 'i'}},{_id:0, link :1,tag:1,desc:1,meta_desc:1,
            meta_imgUrl: 1,meta_title: 1,read_status: 1,created_time: 1, revised_time: 1, link_id:1, favorite_status:1,display_name:1});

        var result =_.union(tagResult);
        var result2 = _.uniq(result,'link');
        return await res.json(result2);

    }catch(err){
        if(err) console.log(err)
    }
});


module.exports = router;