// Import multer
const multer = require('multer');

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}-${Date.now()}`)
  }
});

// Set up multer upload object
const upload = multer({ storage: storage });

module.exports = upload;
 