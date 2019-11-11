var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nameSchema = new Schema({
    name: String,
    user_id: String,
    email: String,
    display_name: String,
    entry_dir_id: String,

});

module.exports = mongoose.model('name',nameSchema,'name');