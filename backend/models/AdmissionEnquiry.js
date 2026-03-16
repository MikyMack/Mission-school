const mongoose = require("mongoose");

const admissionEnquirySchema = new mongoose.Schema({

  parentName: {
    type: String,
    required: [true, "Parent name is required"],
    trim: true,
    minlength: 2,
    maxlength: 100
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
  },

  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    minlength: 10,
    maxlength: 15
  },

  studentName: {
    type: String,
    trim: true,
    maxlength: 100
  },

  grade: {
    type: String,
    trim: true,
    maxlength: 50
  },

  message: {
    type: String,
    trim: true,
    maxlength: 500
  },

  status: {
    type: String,
    enum: ["new", "contacted"],
    default: "new"
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("AdmissionEnquiry", admissionEnquirySchema);