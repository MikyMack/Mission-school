const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { upload } = require('../utils/cloudinary');

router.post('/',upload.single('notice'), noticeController.createNotice);
router.get('/', noticeController.getAllNotices);
router.get('/:id', noticeController.getNoticeById);
router.put('/:id',upload.single('notice'), noticeController.updateNotice);
router.delete('/:id', noticeController.deleteNotice);
router.patch('/:id/toggle', noticeController.toggleNoticeActive);

module.exports = router;
