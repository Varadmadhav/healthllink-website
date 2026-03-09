const mongoose = require("mongoose")

const uploadSchema = new mongoose.Schema({

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
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
    required: true
  },

  status: {
    type: String,
    default: "processed"
  }

}, { timestamps: true })

module.exports = mongoose.model("Upload", uploadSchema)