var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var directorySchema = new Schema({
    dir_id: Number,
    user_id: Number,
    // type: Number,
    dir_tree: [Number],
    link_data: [Number],
    shared: [String]
});


module.exports = mongoose.model('directory',directorySchema,'directory');