const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo.controller');
const upload = require('../middleware/upload');
const guestSession = require('../middleware/guestSession');

// API routes for photos
// Only guests with a valid session can upload
router.post('/photos', guestSession, upload.single('photo'), photoController.uploadPhoto);
router.get('/weddings/:slug/photos', photoController.getPhotos);

module.exports = router;
