const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  employeeId: {
    type: String,
    unique: true,
    sparse: true,
    default: null
  },

  role: {
    type: String,
    enum: ["admin", "hr", "employee"],
    required: true
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null
  }

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)