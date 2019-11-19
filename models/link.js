var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var linkSchema = new Schema({
    link_id: String,
    dir_id: String,
    link: String,
    tag: String,
    desc: String,
    read_status: Number,
    created_time: {type: Date, default: Date.now},
    revised_time: {type: Date, default: Date.now}
});
linkSchema.plugin(autoIncrement.plugin, {
    model:'link',
    field: 'link_id', // auto-increment할 field
    startAt: 5, // 5에서 부터
    increment: 1 // 1씩 증가
   });
module.exports = mongoose.model('link',linkSchema,'link');