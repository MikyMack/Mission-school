const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');

/* Helper: delete image from uploads */
const deleteImage = (imageName) => {
  if (!imageName) return;

  try {
    const filePath = path.join(__dirname, '..', 'uploads', imageName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

  } catch (err) {
    console.error("Image delete error:", err);
  }
};


/* ================================
   Create Blog
================================ */

exports.createBlog = async (req, res) => {
  try {

    const {
      title,
      slug,
      metaTitle,
      metaDescription,
      metaKeywords,
      content,
      author
    } = req.body;

    if (!title || !metaTitle || !metaDescription || !metaKeywords || !content || !author) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Blog image is required" });
    }

    const keywordsArray = metaKeywords
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const blog = new Blog({
      title,
      slug,
      metaTitle,
      metaDescription,
      metaKeywords: keywordsArray,
      content,
      author,
      imageUrl: req.file.filename
    });

    await blog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Slug already exists"
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to create blog",
      error: error.message
    });
  }
};


/* ================================
   Get All Blogs
================================ */

exports.getAllBlogs = async (req, res) => {
  try {

    const search = req.query.search || '';

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { metaTitle: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const blogs = await Blog
      .find(query)
      .sort({ createdAt: -1 });

    res.json(blogs);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch blogs",
      error: error.message
    });
  }
};


/* ================================
   Get Single Blog
================================ */

exports.getBlogById = async (req, res) => {
  console.log("Inside fn");
  
  try {

    const id = req.params.id;
    console.log("Requested ID:", id);

    const blog = await Blog.findById(id);

    console.log("DB result:", blog);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   Update Blog
================================ */

exports.updateBlog = async (req, res) => {
  try {

    const {
      title,
      slug,
      metaTitle,
      metaDescription,
      metaKeywords,
      content,
      author
    } = req.body;

    const blogId = req.params.id;

    const existingBlog = await Blog.findById(blogId);

    if (!existingBlog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    const updateData = {
      title,
      slug,
      metaTitle,
      metaDescription,
      content,
      author
    };

    if (metaKeywords) {
      updateData.metaKeywords = metaKeywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);
    }

    /* Handle new image */
    if (req.file) {

      deleteImage(existingBlog.imageUrl);

      updateData.imageUrl = req.file.filename;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Blog updated successfully",
      blog: updatedBlog
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to update blog",
      error: error.message
    });
  }
};


/* ================================
   Delete Blog
================================ */

exports.deleteBlog = async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    deleteImage(blog.imageUrl);

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      message: "Blog deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to delete blog",
      error: error.message
    });
  }
};