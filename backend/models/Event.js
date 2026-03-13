const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    date: Date,
    title: String,
    description: String,
    image: String,
    coordinatorName: String,
    coordinatorContact: Number,
    eventPlace: String,
    isActive: { type: Boolean, default: true }
  });
  module.exports = mongoose.model('Event', eventSchema);