// user detail schema code

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
      usrnm: String,
      name: String,
      pass: String,
      email: String,
      location: String,
      usrId: String,    // only clients have cltId,
      role: String  //-> 1,2    // 1-supAdmin , 2-Admin , 3-Client
});

module.exports = mongoose.model('users', UserSchema);  // clients - collection name