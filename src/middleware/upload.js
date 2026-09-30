const multer = require('multer');

// Configure multer to store files in memory temporarily
// They will be processed by Sharp and then uploaded to Supabase Storage
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB max size to handle large phone camera photos
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

module.exports = upload;
