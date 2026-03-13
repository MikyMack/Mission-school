const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const { upload } = require('../utils/cloudinary');

router.post('/',upload.single('Profilepic'), alumniController.createAlumni);
router.get('/', alumniController.getAllAlumni);
router.get('/:id', alumniController.getAlumniById);
router.put('/:id',upload.single('Profilepic'), alumniController.updateAlumni);
router.delete('/:id', alumniController.deleteAlumni);

module.exports = router;
