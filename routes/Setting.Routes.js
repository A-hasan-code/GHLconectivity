const { isAuthentication, isAdmin } = require('../middleware/jwttoken');
const express = require('express');
const router = express.Router()
const { createSetting } = require('../controllers/SettingController')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Custom file filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Define allowed file types
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Unsupported file type. Only JPG, PNG, and GIF are allowed.'), false); // Reject file
    }
};

// Initialize Multer with storage and file filter
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5 MB
});


router.post('/settings', upload.single('value'), isAuthentication, isAdmin(['admin', 'superadmin']), createSetting);

module.exports = router;