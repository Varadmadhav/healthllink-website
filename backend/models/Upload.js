const mongoose = require("mongoose")

const uploadSchema = new mongoose.Schema({

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  fileName: String,

  recordsCount: Number,

  status: {
    type: String,
    // "confirmed" = all patients have been assigned a centre by admin
    enum: ["pending", "approved", "rejected", "confirmed"],
    default: "pending"
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  fileName: {
    type: String,
    required: true
  },

  recordsCount: {
    type: Number,
    default: 0
  },

  // NEW FIELD → appointment date for this batch upload
  appointmentDate: {
    type: Date,
    default: null
  },

  status: {
    type: String,
    default: "processed"
  }

}, { timestamps: true })

module.exports = mongoose.model("Upload", uploadSchema)