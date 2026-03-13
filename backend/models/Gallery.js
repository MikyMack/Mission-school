const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  category: String,
  image: String,
  youtubeLink: String,
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Gallery', gallerySchema);
