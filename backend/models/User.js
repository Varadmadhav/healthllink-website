const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
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
    },

    phone: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    pincode: {
      type: String,
      default: ""
    },

    // ── ADDED: link back to Patient record
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null
    },

    // ── ADDED: flag so employee is prompted to change password on first login
    isTemporaryPassword: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)