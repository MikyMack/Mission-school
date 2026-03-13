const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    date: Date,
    title: String,
    description: String,
    posterUrl: String,
    isActive: { type: Boolean, default: true }
  });
  module.exports = mongoose.model('Notice', noticeSchema);