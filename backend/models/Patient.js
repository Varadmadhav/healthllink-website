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

  status: {
    type: String,
    default: "pending"
  },

  assignedCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Center",
    default: null
  },

  // Date change request — only one active request at a time
  // If HR submits again before admin reviews, it just overwrites
  dateChangeRequest: {
    requestedDate: { type: Date, default: null },
    requestedBy: { type: String, enum: ["hr", "employee"], default: null },
    requestedByName: { type: String, default: null },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: null },
    requestedAt: { type: Date, default: null }
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

  // Keep old field for backward compatibility
  reportUrl: {
    type: String,
    default: null
  }

}, { timestamps: true })

module.exports = mongoose.model("Patient", patientSchema)