const Company = require("../models/Company")
const Center = require("../models/Center")
const Upload = require("../models/Upload")
const Patient = require("../models/Patient")
const { getCoordinatesForPincode, haversineDistance } = require("../utils/pincodeUtils")
const fs = require("fs")
const path = require("path")

// ─── Company ────────────────────────────────────────────────────────────────

exports.addCompany = async (req, res) => {
  try {
    const company = new Company(req.body)
    await company.save()
    res.status(201).json(company)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
    res.json(companies)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─── Center ─────────────────────────────────────────────────────────────────

exports.addCenter = async (req, res) => {
  try {
    const { name, email, phone, address, pincode } = req.body
    let latitude = null, longitude = null

    if (pincode) {
      const coords = await getCoordinatesForPincode(pincode)
      if (coords) { latitude = coords.lat; longitude = coords.lng }
    }

    const center = new Center({ name, email, phone, address, pincode, latitude, longitude })
    await center.save()
    res.status(201).json(center)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getCenters = async (req, res) => {
  try {
    const centers = await Center.find()
    res.json(centers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/admin/centers/nearby?pincode=421305&limit=3
exports.getNearbyCenters = async (req, res) => {
  try {
    const { pincode, limit = 3 } = req.query
    if (!pincode) return res.status(400).json({ message: "pincode query param is required" })

    const allCenters = await Center.find()
    if (allCenters.length === 0) return res.json([])

    const empCoords = await getCoordinatesForPincode(pincode)

    if (empCoords) {
      const centersWithDistance = await Promise.all(
        allCenters.map(async (c) => {
          let centerCoords = null
          if (c.latitude && c.longitude) {
            centerCoords = { lat: c.latitude, lng: c.longitude }
          } else if (c.pincode) {
            centerCoords = await getCoordinatesForPincode(c.pincode)
            if (centerCoords) {
              await Center.findByIdAndUpdate(c._id, { latitude: centerCoords.lat, longitude: centerCoords.lng })
            }
          }
          const distance = centerCoords
            ? haversineDistance(empCoords.lat, empCoords.lng, centerCoords.lat, centerCoords.lng)
            : 99999
          return {
            _id: c._id, name: c.name, phone: c.phone || "",
            email: c.email || "", address: c.address || "",
            pincode: c.pincode || "", distance: Math.round(distance * 10) / 10
          }
        })
      )
      return res.json(centersWithDistance.sort((a, b) => a.distance - b.distance).slice(0, parseInt(limit)))
    }

    // Fallback: match by pincode prefix
    const prefix4 = String(pincode).substring(0, 4)
    let matches = allCenters.filter(c => c.pincode && c.pincode.startsWith(prefix4))
    if (matches.length === 0) {
      const prefix3 = String(pincode).substring(0, 3)
      matches = allCenters.filter(c => c.pincode && c.pincode.startsWith(prefix3))
    }
    if (matches.length === 0) matches = allCenters

    res.json(matches.slice(0, parseInt(limit)).map(c => ({
      _id: c._id, name: c.name, phone: c.phone || "", email: c.email || "",
      address: c.address || "", pincode: c.pincode || "", distance: null
    })))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─── Uploads ─────────────────────────────────────────────────────────────────

exports.getUploads = async (req, res) => {
  try {
    const uploads = await Upload
      .find()
      .populate("companyId", "name")
      .populate("uploadedBy", "name")
      .sort({ uploadedAt: -1 })

    const uploadsWithCounts = await Promise.all(
      uploads.map(async (u) => {
       const pendingCount = await Patient.countDocuments({ uploadId: u._id, status: "pending" })
const confirmedCount = await Patient.countDocuments({ uploadId: u._id, status: "confirmed" })
        return { ...u.toObject(), pendingCount, confirmedCount }
      })
    )
    res.json(uploadsWithCounts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getPatientsByUpload = async (req, res) => {
  try {
    const patients = await Patient
      .find({ uploadId: req.params.uploadId })
      .populate("assignedCenterId", "name phone address pincode")
      .populate("companyId", "name")
    res.json(patients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.approveUpload = async (req, res) => {
  try {
    const upload = await Upload.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true })
    await Patient.updateMany({ uploadId: req.params.id }, { status: "approved" })
    res.json(upload)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.rejectUpload = async (req, res) => {
  try {
    const upload = await Upload.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true })
    await Patient.updateMany({ uploadId: req.params.id }, { status: "rejected" })
    res.json(upload)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─── Patients ────────────────────────────────────────────────────────────────

exports.assignCenter = async (req, res) => {
  try {
    const { centerId } = req.body
    if (!centerId) return res.status(400).json({ message: "centerId is required" })

    const patient = await Patient.findByIdAndUpdate(
      req.params.patientId,
      { assignedCenterId: centerId, status: "confirmed" },
      { new: true }
    )
      .populate("assignedCenterId", "name phone address pincode")
      .populate("companyId", "name")

    if (!patient) return res.status(404).json({ message: "Patient not found" })

    // If all patients in this upload are confirmed, mark upload as confirmed
    if (patient.uploadId) {
      const totalInUpload = await Patient.countDocuments({ uploadId: patient.uploadId })
      const confirmedInUpload = await Patient.countDocuments({
  uploadId: patient.uploadId,
  status: "confirmed"
})
      if (totalInUpload > 0 && totalInUpload === confirmedInUpload) {
        await Upload.findByIdAndUpdate(patient.uploadId, { status: "confirmed" }, { new: true })
      }
    }

    // ── Create employee account if not exists, then send confirmation email ──
    try {
      const User = require("../models/User")
      const bcrypt = require("bcryptjs")
      const crypto = require("crypto")
      const { sendConfirmationEmail } = require("../utils/emailService")

      const companyName = patient.companyId?.name || "Your Company"
      const centerName = patient.assignedCenterId?.name || "Assigned Center"
      const centerAddress = patient.assignedCenterId?.address
        ? `${patient.assignedCenterId.address} - ${patient.assignedCenterId.pincode || ""}`
        : "Address not available"
      const appointmentDate = patient.appointmentDate
        ? new Date(patient.appointmentDate).toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric"
          })
        : "To be confirmed"

      // Check if user account already exists for this email + company
      let existingUser = await User.findOne({
        email: patient.email,
        companyId: patient.companyId?._id || patient.companyId
      })

      if (!existingUser) {
        // ── No account yet — create one with a temp password
        const tempPassword = crypto.randomBytes(4).toString("hex") // e.g. "a3f9b2c1"
        const hashedPassword = await bcrypt.hash(tempPassword, 10)

        const newUser = new User({
          name: patient.name,
          email: patient.email,
          password: hashedPassword,
          role: "employee",
          companyId: patient.companyId?._id || patient.companyId,
          phone: patient.phone || "",
          address: patient.address || "",
          pincode: patient.pincode || "",
          patientId: patient._id,
          isTemporaryPassword: true
        })

        await newUser.save()

        // Send confirmation email WITH login credentials
        await sendConfirmationEmail({
          toEmail: patient.email,
          employeeName: patient.name,
          companyName,
          centerName,
          centerAddress,
          appointmentDate,
          loginId: patient.email,
          tempPassword,
          isExistingUser: false
        })

      } else {
        // ── Account exists — link patientId if missing, send email without credentials
        if (!existingUser.patientId) {
          existingUser.patientId = patient._id
          await existingUser.save()
        }

        await sendConfirmationEmail({
          toEmail: patient.email,
          employeeName: patient.name,
          companyName,
          centerName,
          centerAddress,
          appointmentDate,
          loginId: patient.email,
          tempPassword: null,
          isExistingUser: true
        })
      }
    } catch (emailErr) {
      // Don't fail the assignment if email/account creation fails
      console.error("Confirmation email/account error:", emailErr.message)
    }

    res.json(patient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient
      .find()
      .populate("assignedCenterId", "name phone address pincode")
      .populate("companyId", "name")
      .sort({ createdAt: -1 })
    res.json(patients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─── Date Change Request ──────────────────────────────────────────────────────
// POST /api/admin/patients/:patientId/request-date
// Called by HR (or employee portal) to request a new appointment date
// Body: { requestedDate, requestedBy ("hr"|"employee"), requestedByName }

exports.requestDateChange = async (req, res) => {
  try {
    const { requestedDate, requestedBy, requestedByName } = req.body

    if (!requestedDate) return res.status(400).json({ message: "requestedDate is required" })
    if (!["hr", "employee"].includes(requestedBy)) {
      return res.status(400).json({ message: "requestedBy must be 'hr' or 'employee'" })
    }

    const patient = await Patient.findById(req.params.patientId)
    if (!patient) return res.status(404).json({ message: "Patient not found" })

    // 48-hour rule: cannot request change if current appointment is within 48 hours
    if (patient.appointmentDate) {
      const hoursUntilAppointment = (new Date(patient.appointmentDate) - new Date()) / (1000 * 60 * 60)
      if (hoursUntilAppointment < 48) {
        return res.status(400).json({
          message: "Cannot request date change — appointment is less than 48 hours away"
        })
      }
    }

    // Requested date must also be at least 48 hours from now
    const hoursUntilRequested = (new Date(requestedDate) - new Date()) / (1000 * 60 * 60)
    if (hoursUntilRequested < 48) {
      return res.status(400).json({
        message: "Requested date must be at least 48 hours from now"
      })
    }

    // Overwrite any existing pending request (no duplicate entries)
    patient.dateChangeRequest = {
      requestedDate: new Date(requestedDate),
      requestedBy,
      requestedByName: requestedByName || requestedBy,
      status: "pending",
      requestedAt: new Date()
    }

    await patient.save()

    // Notify the employee that HR requested a date change on their behalf
    try {
      const { sendDateChangeNotification } = require("../utils/emailService")
      if (patient.email) {
        await sendDateChangeNotification({
          toEmail: patient.email,
          recipientName: patient.name,
          employeeName: patient.name,
          currentDate: patient.appointmentDate,
          requestedDate: new Date(requestedDate),
          action: "requested",
          requestedBy: "hr"
        })
      }
    } catch (emailErr) {
      console.error("Employee notification email failed:", emailErr.message)
    }

    res.json({ message: "Date change request submitted", patient })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/admin/patients/date-change-requests
// Returns all patients that have a pending date change request

exports.getDateChangeRequests = async (req, res) => {
  try {
    const patients = await Patient
      .find({ "dateChangeRequest.status": "pending" })
      .populate("assignedCenterId", "name phone address pincode")
      .populate("companyId", "name")
      .sort({ "dateChangeRequest.requestedAt": -1 })
    res.json(patients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/admin/patients/:patientId/approve-date
// Admin approves a date change request
// Body: { action: "approve" | "reject" }

exports.reviewDateChange = async (req, res) => {
  try {
    const { action } = req.body
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "action must be 'approve' or 'reject'" })
    }

    const patient = await Patient.findById(req.params.patientId)
    if (!patient) return res.status(404).json({ message: "Patient not found" })
    if (!patient.dateChangeRequest || patient.dateChangeRequest.status !== "pending") {
      return res.status(400).json({ message: "No pending date change request found" })
    }

    if (action === "approve") {
      const newDate = patient.dateChangeRequest.requestedDate

      // 48-hour rule also applies to the new date from admin side
      // (the new requested date must be >48hrs away from now)
      const hoursUntilNew = (new Date(newDate) - new Date()) / (1000 * 60 * 60)
      if (hoursUntilNew < 48) {
        return res.status(400).json({
          message: "Cannot approve — requested date is less than 48 hours away"
        })
      }

      patient.appointmentDate = newDate
      patient.dateChangeRequest.status = "approved"
    } else {
      patient.dateChangeRequest.status = "rejected"
    }

    await patient.save()

    const populated = await Patient
      .findById(patient._id)
      .populate("assignedCenterId", "name phone address pincode")
      .populate("companyId", "name")

    // ── Send email notifications ──────────────────────────────────────────────
    try {
      const { sendDateChangeNotification } = require("../utils/emailService")
      const User = require("../models/User")
      const requestedBy = patient.dateChangeRequest.requestedBy // "hr" or "employee"
      const companyId = patient.companyId

      // Always notify the employee about the decision
      if (patient.email) {
        await sendDateChangeNotification({
          toEmail: patient.email,
          recipientName: patient.name,
          employeeName: patient.name,
          currentDate: action === "approve" ? patient.dateChangeRequest.requestedDate : patient.appointmentDate,
          requestedDate: patient.dateChangeRequest.requestedDate,
          action,
          requestedBy
        })
      }

      // If HR made the request, notify HR of the decision too
      if (requestedBy === "hr") {
        const hrUser = await User.findOne({ role: "hr", companyId })
        if (hrUser) {
          await sendDateChangeNotification({
            toEmail: hrUser.email,
            recipientName: hrUser.name,
            employeeName: patient.name,
            currentDate: patient.appointmentDate,
            requestedDate: patient.dateChangeRequest.requestedDate,
            action,
            requestedBy
          })
        }
      }

      // If employee made the request, notify HR of the decision
      if (requestedBy === "employee") {
        const hrUser = await User.findOne({ role: "hr", companyId })
        if (hrUser) {
          await sendDateChangeNotification({
            toEmail: hrUser.email,
            recipientName: hrUser.name,
            employeeName: patient.name,
            currentDate: patient.appointmentDate,
            requestedDate: patient.dateChangeRequest.requestedDate,
            action,
            requestedBy
          })
        }
      }
    } catch (emailErr) {
      console.error("Date change notification email failed:", emailErr.message)
      // Don't fail the request if email fails
    }

    res.json({ message: `Date change ${action}d`, patient: populated })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─── Reports ─────────────────────────────────────────────────────────────────

exports.uploadReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })

    const reportEntry = {
      url: `/uploads/reports/${req.file.filename}`,
      originalName: req.file.originalname,
      uploadedAt: new Date()
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.patientId,
      { $push: { reportUrls: reportEntry } },
      { new: true }
    )

    if (!patient) return res.status(404).json({ message: "Patient not found" })
    res.json({ reportEntry, patient })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteReport = async (req, res) => {
  try {
    const { reportUrl } = req.body
    if (!reportUrl) return res.status(400).json({ message: "reportUrl is required" })

    const patient = await Patient.findByIdAndUpdate(
      req.params.patientId,
      { $pull: { reportUrls: { url: reportUrl } } },
      { new: true }
    )

    if (!patient) return res.status(404).json({ message: "Patient not found" })

    const filePath = path.join(__dirname, "../", reportUrl)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    res.json({ message: "Report deleted", patient })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
exports.rejectPatient = async (req, res) => {
  try {
    const patientCheck = await Patient.findById(req.params.patientId)
if (patientCheck.status !== "confirmed") {
  return res.status(400).json({ message: "Cannot upload report for non-confirmed patient" })
}
    const patient = await Patient.findByIdAndUpdate(
      req.params.patientId,
      {
        status: "rejected",
        assignedCenterId: null
      },
      { new: true }
    )

    if (!patient) return res.status(404).json({ message: "Patient not found" })

    res.json(patient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}