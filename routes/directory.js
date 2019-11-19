var express = require('express');
var router = express.Router();
const userModel = require('../models/user');
// const directoryModel = require('../models/directory');
// const directoryNameModel = require('../models/directoryName');

router.post('/:display_name',function(req,res){
    userModel.find({display_name:req.params.display_name},{_id:0,entry_dir_id: 1},function (err, userModel){
        if(err) return res.status(500).json({error:err});
        if(!userModel){
            return res.send('not exist user');
        }
        return console.log("finding name");

        //res.json(userModel);
    })
});

module.exports = router;

