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
    try{
        resultarray = await userModel.find({},{_id:0,display_name:1, name:1}).where("follower").in([displayName])
            .regex("display_name" ,query);
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
   // console.log(followingarray[0][1].following_status); following 상태 접근법
   return res.json(followingarray)
})

// //TODO follower 상태에 따라서 출력 분리 필요

//         // nonresultarray= userModel.find({},{_id:0,display_name:1, name:1,follower:1}).regex("display_name" ,query).where("follower").nin([displayName]).exec(function (err,display_name) {
//         //     if(display_name.length == 0) return res.send("search failed");
//         //
//         //     else {
//         //         return res.json(display_name);
//         //     }
//         // })
//     }
//     catch (err) {
//         console.log(err);
//     }
// })



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
