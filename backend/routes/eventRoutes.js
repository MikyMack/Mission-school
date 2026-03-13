const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { upload } = require('../utils/cloudinary');

router.post('/',upload.single('events'), eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id',upload.single('events'), eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);
router.patch('/toggle/:id', eventController.toggleEventActive);

module.exports = router;
