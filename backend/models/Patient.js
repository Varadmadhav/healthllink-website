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

  reportUrl: {
    type: String,
    default: null
  }

}, { timestamps: true })

module.exports = mongoose.model("Patient", patientSchema)