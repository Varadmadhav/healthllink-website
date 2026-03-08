const mongoose = require("mongoose")

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: String,

  phone: String,

  address: String,

  pincode: String

}, { timestamps: true })

module.exports = mongoose.model("Company", companySchema)