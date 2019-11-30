var express = require('express');
var router = express.Router();
const userModel = require('../models/user');

//follower한 유저 호출
router.post("/:display_name/read", async (req,res)=>{
    let follower = null;

    try {
        follower = await userModel.find({
            display_name: req.params.display_name
        }, {_id: 0, follower: 1});
        console.log("DB find");
    }
     catch(e){
        console.log(err);
        return res.status(500).json({
            msg: "DB find error"
        });
    }

    let resultArray = [];
    for(let i =0;i< follower.length; i++){
        let result = null;
        try{
            result = await userModel.find({
                display_name: follower[i].follower
            },{
                _id:0, display_name:1,name:1
            });
        }catch (err) {
            console.log(err);
            continue;
        }
        resultArray.push(result);
    }
    return res.json(resultArray[0]);
});

module.exports = router;