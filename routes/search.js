var express = require("express");
var router = express.Router();
const userModel = require("../models/user");
const linkModel = require("../models/link");
const directoryModel = require("../models/directory");

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
        resultarray = await userModel.find({},{_id:0,display_name:1, name:1}).where("follower").in([displayName])
            .regex("display_name" ,query);
        resultarray2 = await userModel.find({},{_id:0,display_name:1, name:1,follower:1}).where("follower").nin([displayName])
            .regex("display_name" ,query)

    }catch(err){
        if(err) console.log(err)
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
            });
        }catch(err){
            console.log(err);
            continue;
        }
        result.push(followingStatus);
      followingarray.push(result);
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
            });
        }catch(err){
            console.log(err);
            continue;
        }
        result2.push(followingStatus);
        nonfollowingarray.push(result2);
    }

    let resultArray =[];
    for(var i in followingarray){
        resultArray.push(followingarray[i]);
    }
    for(var j in nonfollowingarray){
        resultArray.push(nonfollowingarray[j]);
    }

   //  following 상태 접근법
   //  console.log(resultArray[0][1].following_status);
   //  console.log(resultArray[1][1].following_status);
   //  console.log(resultArray[2][1].following_status);
   return res.json(resultArray);

});

module.exports = router;

// router.get("/", async(req,res)=>{
//      let displayname =null;
//     displayname = await userModel.find({},{_id:0, display_name:1},function (err){
//         if(err) console.log(err);
//     });
//
//     let resultArray = [];
//
//     for(let i =0; i<(displayname[0].display_name).length;i++){
//         let result = null;
//         try{
//             result = await userModel.find({
//                 display_name: (displayname[i].display_name)
//             },{
//                 _id:0, display_name:1
//             });
//         } catch (e) {
//             console.log(err);
//             continue;
//         }
//         resultArray.push(displayname[i].display_name);
//     }
//     if(resultArray.length ==0) return res.send("search failed");
//     else{ return res.json(resultArray);}
// })
