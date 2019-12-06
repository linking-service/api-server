var express = require('express');
var router = express.Router();
const userModel = require('../models/user');
const _ = require("underscore");
const cors = require('cors');

router.post('/', async (req,res)=>{
    userModel.findOne({email:req.body.email}, function(err, email){
        if(err) return res.status(500).json({error:err});
        //등록되지 않은 user 등록
        if(!email){
            var user = new userModel(
                {   
                    email : req.body.email,
                    name : req.body.name,
                    display_name : req.body.name,
                });

            user.save(function (err) {
                if(err) return console.log(err);
                console.log('user information saved!');
              });
            return res.status(404).json({code : 0});
        }
       // res.json({code : 1});
    })

    let displayName;
    displayName= await userModel.find({email:req.body.email},{_id:0, display_name:1}).lean();
    let code = {"code" :1};
    Object.assign(code,displayName[0]);

    return await res.json(code);

});

//사용자 탈퇴
router.get("/:display_name/delete",function (req,res){
    userModel.deleteOne({display_name: req.params.display_name},function (err) {
        if(err) {
            console.log(err);
            res.status(404).send('delete fail');
        }else{
            res.status(200).send('delete user');
        }
    });

})


module.exports = router;
