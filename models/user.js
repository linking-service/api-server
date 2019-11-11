var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    user_id: String,
    email: String,
    name: String,
    display_name: String,
 //   following: [String],
  //  follower: [String],
    entry_dir_id: String,
   // workflow: [String]
});

module.exports = mongoose.model('user',userSchema,'user');