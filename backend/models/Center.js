const mongoose = require("mongoose")

const centerSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  phone: String,

  email: String,

  address: String,

  pincode: String,

  // Auto-populated from pincode when centre is added
  latitude: {
    type: Number,
    default: null
  },

  longitude: {
    type: Number,
    default: null
  }

}, { timestamps: true })

module.exports = mongoose.model("Center", centerSchema)