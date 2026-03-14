const mongoose = require("mongoose")

const uploadSchema = new mongoose.Schema({

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
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
    ref: "User"
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Upload", uploadSchema)