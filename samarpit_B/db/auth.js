// auth schema code

const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
      usrnm: String,
      name: String,
      pass: String,
      email: String,
      location: String,
      cltId: String,    // only clients have cltId,
      usrId: String,  // only admins have usrId 
      role: String  //-> 3    // 1-supAdmin , 2-Admin , 3-Client
});

module.exports = mongoose.model('auths', AuthSchema);  // auths - collection name

// {
// "usrnm" : "user4",
// "name" : "user four",
// "pass" : "123",
// "email" : "user4mail",
// "location" : "ujjain",
// "cltId" : "usr5654",
// "usrId" : "usr5654",
// "role" : "2"
// }