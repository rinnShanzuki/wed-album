const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');
const guestSession = require('../middleware/guestSession');

// Guest routes for a specific wedding
router.get('/:slug', guestController.getWelcome);
router.get('/:slug/name', guestController.getName);
router.post('/:slug/name', guestController.postName);

// Protected guest routes (require name session)
router.use('/:slug', guestSession);
router.get('/:slug/camera', guestController.getCamera);
router.get('/:slug/album', guestController.getAlbum);
router.get('/:slug/success', guestController.getSuccess);

module.exports = router;
