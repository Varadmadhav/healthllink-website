const mongoose = require("mongoose")

const uploadSchema = new mongoose.Schema({

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },

  fileName: String,

  recordsCount: Number,

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