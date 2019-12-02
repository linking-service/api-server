var express = require("express");
var router = express.Router();
const userModel = require("../models/user");
const linkModel = require("../models/link");
const directoryModel = require("../models/directory");

//user 검색
router.get('/:keyword',async (req,res)=>{
    const query = req.params.keyword;
    if(!query){
        return res.send("no keyword");
    }
    try{
        userModel.find({},{_id:0,display_name:1}).regex("display_name" ,query).exec(function (err,display_name) {
            return res.json(display_name);
        })
    }catch (err) {
        console.log(err);
    }
})

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


module.exports = router;