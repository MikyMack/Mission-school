const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { upload } = require('../utils/multer');

router.post('/',upload.single('galleryImage'), galleryController.createGallery);
router.get('/', galleryController.getAllGallery);
router.get('/:id', galleryController.getGalleryById);
router.put('/:id',upload.single('galleryImage'), galleryController.updateGallery);
router.delete('/:id', galleryController.deleteGallery);
router.patch('/:id/toggle', galleryController.toggleGalleryActive);

module.exports = router;
