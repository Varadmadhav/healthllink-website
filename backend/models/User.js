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
    // ── FIX: undefined default instead of null — null breaks sparse unique index
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      default: undefined
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
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null
    },
    isTemporaryPassword: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)