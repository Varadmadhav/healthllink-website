const mongoose = require("mongoose")

const centerSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  phone: String,

  address: String,

  pincode: String

}, { timestamps: true })

module.exports = mongoose.model("Center", centerSchema)