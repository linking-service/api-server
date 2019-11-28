var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var linkSchema = new Schema({
    link_id: Number,
    dir_id: Number,
    link: String,
    tag: String,
    //tag array[string]변경
    desc: String,
    read_status: Number,
    favorite_status :Number,
    meta_title: String,
    meta_desc :String,
    meta_imgUrl :String,
    created_time: {type: Date, default: Date.now},
    revised_time: {type: Date, default: Date.now}
});

linkSchema.plugin(autoIncrement.plugin, {
    model:'link',
    field: 'link_id', // auto-increment할 field
    startAt: 0, // 5에서 부터
    increment: 1 // 1씩 증가
});

module.exports = mongoose.model('link',linkSchema,'link');