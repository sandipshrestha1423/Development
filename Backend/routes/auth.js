const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { register, login, logout, checkMe, updateUserProfile } = require('../controllers/authController');

const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, 
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const isImage = filetypes.test(file.mimetype);
        if (isImage) return cb(null, true);
        cb(new Error('Please upload an image only (jpg, png, or webp).'));
    }
});

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.get('/me', checkMe);

router.put('/profile', authMiddleware, upload.single('profileImage'), updateUserProfile);

module.exports = router;