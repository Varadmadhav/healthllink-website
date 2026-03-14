// backend/models/PincodeCache.js
const mongoose = require("mongoose")

const pincodeCacheSchema = new mongoose.Schema({

  pincode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  lat: {
    type: Number,
    required: true
  },

  lng: {
    type: Number,
    required: true
  },

  resolvedAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("PincodeCache", pincodeCacheSchema)