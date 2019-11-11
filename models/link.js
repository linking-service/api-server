var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var linkSchema = new Schema({
    link_id: String,
    dir_id: String,
    link: String,
    tag: String,
    desc: String,
    read_status: Int32Array,
    created_time: {type: Date, default: Date.now},
    revised_time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('link',linkSchema,'link');