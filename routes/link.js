var express = require('express');
var router = express.Router();
const linkModel = require('../models/link');
const directoryModel = require('../models/directory');



// link 추가
router.post('/:dir_id/saved',function(req,res){
    directoryModel.findOne({dir_id:req.body.dir_id}, function(err, result){
        if(err) return res.send('error');
        if(!result){
            var link = new linkModel({
                dir_id : req.body.dir_id,
                link : req.body.link,
                tag : req.body.tag,
                desc : req.body.desc,
                read_status : 1
            });

            link.save(function (err) {
                if(err) return console.log(err);
                console.log('link saved!');
                return res.send('saved');
            });
        }
    })

});
module.exports = router;