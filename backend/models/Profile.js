const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  tests: {
    type: [String],
    default: []
  },
  fastingRequired: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model("Profile", profileSchema)
