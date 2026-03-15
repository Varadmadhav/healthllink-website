const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema({

  uploadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Upload"
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },

  name: String,
  gender: String,
  age: Number,
  phone: String,
  email: String,
  address: String,
  pincode: String,

  appointmentDate: {
    type: Date,
    default: null
  },
 rescheduleRequestDate: {
    type: Date,
    default: null
  },

  rescheduleStatus: {
    type: String,
    enum: ["none", "requested", "approved", "rejected"],
    default: "none"
  },
  
  status: {
    type: String,
    default: "pending"
  },

  assignedCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Center",
    default: null
  },

  // Multiple reports — each entry has url, originalName, uploadedAt
  reportUrls: {
    type: [
      {
        url: String,
        originalName: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    default: []
  },

  // Keep old field for backward compatibility with existing data
  reportUrl: {
    type: String,
    default: null
  }

}, { timestamps: true })

module.exports = mongoose.model("Patient", patientSchema)