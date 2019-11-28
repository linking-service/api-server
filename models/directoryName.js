var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');


var directoryNameSchema = new Schema({
    dir_id: Number,
    name: String,
    //type : 0 == private, 1 == public
    dir_type: {type:Number, default:0}
});

directoryNameSchema.plugin(autoIncrement.plugin, {
    model:'directoryName',
    field: 'dir_id', // auto-increment할 field
    startAt: 0, // 5에서 부터
    increment: 1 // 1씩 증가
});


module.exports = mongoose.model('directoryName',directoryNameSchema,'directoryName');