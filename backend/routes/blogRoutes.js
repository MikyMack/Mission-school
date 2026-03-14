const express = require('express');
const router = express.Router();
const { upload } = require('../utils/multer');
const blogController = require('../controllers/blogController');


router.post('/', upload.single('image'), blogController.createBlog);

router.get('/', blogController.getAllBlogs);

router.get('/:id', blogController.getBlogById);

router.put('/:id', upload.single('image'), blogController.updateBlog);

router.delete('/:id', blogController.deleteBlog);

module.exports = router;