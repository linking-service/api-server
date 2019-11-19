const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    name: String,
    display_name: String,
    following: [String],
    follower: [String],
    entry_dir_id: [String],
    workflow: [String]
});

module.exports = mongoose.model('user',userSchema,'user');