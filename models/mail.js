var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var mailSchema = new Schema({
    display_name: String,
    message: String,
    sender: String,
    mail_id:Number,
    status : Number,
    created_time: {type: Date, default: Date.now},
});

mailSchema.plugin(autoIncrement.plugin, {
    model:'mail',
    field: 'mail_id', // auto-increment할 field
    startAt: 0, // 5에서 부터
    increment: 1 // 1씩 증가
});
module.exports = mongoose.model('mail',mailSchema,'mail');