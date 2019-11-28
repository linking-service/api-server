const express = require('express');
var router = express.Router();
var name = require('../models/name');
// name: String,
//     user_id: String,
//     email: String,
//     display_name: String,
//     entry_dir_id: String,
// module.exports = function(app, name) {
//   app.get()
// };
router.get('/name', function (req, res) {

    res.send("Hi");

    // name.find(function(err, names) {
    //     if(err) return res.status(500).send({error: 'db failure'});
    //     res.json(names);
    // })
});
router.post('/name', function(req, res){
    debug('name Post');

    console.log(req.body);
    console.log("Test");
    return res.json({code: 0});

});







module.exports = router;