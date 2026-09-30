const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminAuth = require('../middleware/adminAuth');

// Public admin routes
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.post('/logout', adminController.postLogout);

// Protected admin routes
router.use(adminAuth);
router.get('/', (req, res) => res.redirect('/admin/album'));
router.get('/qr', adminController.getQr);
router.get('/album', adminController.getAlbum);
router.delete('/photos/:id', adminController.deletePhoto); // Use for deleting photos

module.exports = router;
