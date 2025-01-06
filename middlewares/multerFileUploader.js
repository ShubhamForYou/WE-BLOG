const multer = require("multer");

// multer

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = upload;
