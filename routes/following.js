var express = require('express');
var router = express.Router();
const userModel = require('../models/user');

//following한 유저 호출
router.post("/:display_name/read", async (req,res)=>{
    let result = null;

    try{
        result = await userModel.find({
            display_name : req.params.display_name
        },{_id:0, following :1});
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

module.exports = router;