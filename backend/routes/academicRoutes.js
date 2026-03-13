const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');
const { upload } = require('../utils/cloudinary');

router.post('/',upload.single('AcademicImage'), academicController.createAcademic);
router.get('/', academicController.getAllAcademics);
router.get('/:id', academicController.getAcademicById);
router.put('/:id',upload.single('AcademicImage'), academicController.updateAcademic);
router.delete('/:id', academicController.deleteAcademic);

module.exports = router;
