const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema({

  uploadId: { type: mongoose.Schema.Types.ObjectId, ref: "Upload" },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },

  name: String,
  gender: String,
  age: Number,
  phone: String,
  email: String,
  address: String,
  pincode: String,

  // Joining date from Excel — internal only, never shown on frontend
  joiningDate: { type: Date, default: null },

  // Appointment date — null until admin assigns it during confirmation
  appointmentDate: { type: Date, default: null },
  appointmentTime: { type: String, default: "10:00" },

  rescheduleRequestDate: { type: Date, default: null },
  rescheduleStatus: {
    type: String,
    enum: ["none", "requested", "approved", "rejected"],
    default: "none"
  },

  status: { type: String, default: "pending" },

  assignedCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Center",
    default: null
  },

  // One active date change request at a time
  dateChangeRequest: {
    requestedDate:   { type: Date,   default: null },
    requestedBy:     { type: String, enum: ["hr", "employee"], default: null },
    requestedByName: { type: String, default: null },
    status:          { type: String, enum: ["pending", "approved", "rejected"], default: null },
    requestedAt:     { type: Date,   default: null }
  },

  // Archive of previous appointments
  pastAppointments: {
    type: [
      {
        appointmentDate:  { type: Date },
        assignedCenterId: { type: mongoose.Schema.Types.ObjectId, ref: "Center", default: null },
        status:           { type: String },
        uploadId:         { type: mongoose.Schema.Types.ObjectId, ref: "Upload", default: null },
        archivedAt:       { type: Date, default: Date.now }
      }
    ],
    default: []
  },

  reportUrls: {
    type: [
      {
        url: String,
        originalName: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    default: []
  },

  reportUrl: { type: String, default: null }

}, { timestamps: true })

module.exports = mongoose.model("Patient", patientSchema)