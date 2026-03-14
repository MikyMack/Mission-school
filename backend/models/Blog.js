// models/Blog.js
const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true
    },

    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    metaKeywords: { type: [String], required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true }
  },
  { timestamps: true }
);


// 🔹 Auto-generate slug if not provided by admin
BlogSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // replace special chars with -
      .replace(/(^-|-$)/g, '');   // remove leading/trailing -
  }
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);
