var express = require('express');
var router = express.Router();
const linkModel = require('../models/link');

// link 추가
router.post('/:dir_id/save',function(req,res){
    if(err) return res.send('link save fail');

    var link = new linkModel({
        dir_id : req.body.dir_id,
        link : req.body.link,
        tag : req.body.tag,
        desc : req.body.desc,
        read_status : null,
        create_time : new Date(),
        resived_time : new Date()
    })
    link.save(function (err) {
        if(err) return console.log(err);
        console.log('link save done');
      });
});



module.exports = router;
