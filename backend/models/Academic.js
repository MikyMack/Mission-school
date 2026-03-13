const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
    title: String,
    availableSeats: Number,
    requiredAge: String, // e.g., '12-15'
    description: String,
    subjects: [String],
    image: String
  });
  module.exports = mongoose.model('Academic', academicSchema);
  