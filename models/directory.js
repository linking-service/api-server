var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var directorySchema = new Schema({
    dir_id: String,
    user_id: String,
    // type: Number,
    dir_tree: Array,
    link_data: Array,
    shared: Array
});

module.exports = mongoose.model('directory',directorySchema,'directory');