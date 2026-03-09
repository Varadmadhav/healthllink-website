const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema({

  uploadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Upload",
    required: true
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },

  age: {
    type: Number,
    required: true
  },

  date: {
    type: Date
  },

  // NEW FIELD → Same appointment date for all patients in Excel upload
  appointmentDate: {
    type: Date,
    required: true
  },

  phone: {
    type: String
  },

  email: {
    type: String,
    trim: true
  },

  address: {
    type: String
  },

  pincode: {
    type: String
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "completed"],
    default: "pending"
  },

  assignedCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Center",
    default: null
  },

  reportUrl: {
    type: String,
    default: null
  }

}, { timestamps: true })

module.exports = mongoose.model("Patient", patientSchema)