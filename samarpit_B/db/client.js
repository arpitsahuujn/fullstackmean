// client detail schema code

const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
      usrnm: String,
      name: String,
      pass: String,
      email: String,
      location: String,
      cltId: String,    // only clients have cltId,
      role: String,  //-> 3    // 1-supAdmin , 2-Admin , 3-Client
      image1Url: String,
      image1publicId: String,
      uploadedFileUrl: String,
      uploadedFilePublicId: String,
      
});

module.exports = mongoose.model('clients', ClientSchema);  // clients - collection name