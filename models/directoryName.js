var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var directoryNameSchema = new Schema({
    dir_id: String,
    name: String
});

module.exports = mongoose.model('directoryName',directoryNameSchema,'directoryName');