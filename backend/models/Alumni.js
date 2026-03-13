const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
    profilePic: String,
    name: String,
    message: String,
    batch: String,
    date: Date,
    currentPosition: String
  });
  module.exports = mongoose.model('Alumni', alumniSchema);
  