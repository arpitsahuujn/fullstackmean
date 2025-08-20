// multer.js
const multer = require("multer");

const storage = multer.memoryStorage(); // store file in memory before upload
const upload = multer({ storage });

module.exports = upload;
