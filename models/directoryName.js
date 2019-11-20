var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');


var directoryNameSchema = new Schema({
    dir_id: Number,
    name: String
});

directoryNameSchema.plugin(autoIncrement.plugin, {
    model:'directoryName',
    field: 'dir_id', // auto-increment할 field
    startAt: 0, // 5에서 부터
    increment: 1 // 1씩 증가
});


module.exports = mongoose.model('directoryName',directoryNameSchema,'directoryName');