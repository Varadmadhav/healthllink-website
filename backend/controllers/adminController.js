const Company = require("../models/Company")
const Center = require("../models/Center")
const Upload = require("../models/Upload")
const Patient = require("../models/Patient")
const { getCoordinatesForPincode, haversineDistance } = require("../utils/pincodeUtils")
const fs = require("fs")
const path = require("path")

// ─── Company ─────────────────────────────────────────────────────────────────

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

// ─── Center ──────────────────────────────────────────────────────────────────

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

// ─── Uploads ──────────────────────────────────────────────────────────────────

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

// ─── Shared helper ────────────────────────────────────────────────────────────
// Sends confirmation email and creates User account if needed.
// Called by assignCenter AND reviewDateChange (approve path).
// overrideDate: pass a plain JS Date to force a specific date in the email,
// bypassing whatever is cached in patient.appointmentDate.

async function sendConfirmationEmailForPatient(patient, overrideDate) {
  try {
    const User = require("../models/User")
    const bcrypt = require("bcryptjs")
    const crypto = require("crypto")
    const { sendConfirmationEmail } = require("../utils/emailService")

    const companyName = patient.companyId?.name || "Your Company"
    const centerName = patient.assignedCenterId?.name || "To be assigned"
    const centerAddress = patient.assignedCenterId?.address
      ? `${patient.assignedCenterId.address} - ${patient.assignedCenterId.pincode || ""}`
      : "Will be communicated shortly"

    // Bulletproof date formatting:
    // 1. Use overrideDate if provided (always a plain JS Date from reviewDateChange)
    // 2. Fall back to patient.appointmentDate
    // 3. Convert via .toISOString() to break any Mongoose internal reference
    const dateToUse = overrideDate || patient.appointmentDate
    let appointmentDate = "To be confirmed"
    if (dateToUse) {
      try {
        const d = new Date(
          dateToUse instanceof Date ? dateToUse.toISOString() : dateToUse
        )
        if (!isNaN(d.getTime())) {
          appointmentDate = d.toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric"
          })
        }
      } catch (e) {
        appointmentDate = String(dateToUse)
      }
    }

    const companyId = patient.companyId?._id || patient.companyId

    // Atomic find-or-create — prevents duplicate User records for same email+company
    const existingUser = await User.findOne({ email: patient.email, companyId })

    if (!existingUser) {
      // First time — create account with temp password, send credentials in email
      const tempPassword = crypto.randomBytes(4).toString("hex")
      const hashedPassword = await bcrypt.hash(tempPassword, 10)

      await User.findOneAndUpdate(
        { email: patient.email, companyId },
        {
          $setOnInsert: {
            name: patient.name,
            email: patient.email,
            password: hashedPassword,
            role: "employee",
            companyId,
            phone: patient.phone || "",
            address: patient.address || "",
            pincode: patient.pincode || "",
            patientId: patient._id,
            isTemporaryPassword: true
          }
        },
        { upsert: true, new: true }
      )

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
      // Account exists — link patientId if missing, send without credentials
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
    console.error("Confirmation email/account error:", emailErr.message)
  }
}

// ─── Patients ─────────────────────────────────────────────────────────────────

exports.assignCenter = async (req, res) => {
  try {
    const { centerId } = req.body
    if (!centerId) return res.status(400).json({ message: "centerId is required" })
 
    // Read current patient to check for pending DCR before updating
    const existing = await Patient.findById(req.params.patientId)
      .select("dateChangeRequest appointmentDate")
 
    const updateFields = {
      assignedCenterId: centerId,
      status: "confirmed"
    }
 
    // If there's a pending DCR, approve it AND update appointmentDate to the
    // requested date so the DB is consistent and the email shows the right date
    let emailOverrideDate = null
    if (existing?.dateChangeRequest?.status === "pending") {
      updateFields["dateChangeRequest.status"] = "approved"
 
      // Capture requested date as plain JS Date before any DB ops
      const dcrDate = existing.dateChangeRequest.requestedDate
      emailOverrideDate = new Date(
        dcrDate instanceof Date ? dcrDate.toISOString() : dcrDate
      )
 
      // Also update appointmentDate to the new requested date
      updateFields.appointmentDate = emailOverrideDate
    }
 
    const patient = await Patient.findByIdAndUpdate(
      req.params.patientId,
      { $set: updateFields },
      { new: true }
    )
      .populate("assignedCenterId", "name phone address pincode")
      .populate("companyId", "name")
 
    if (!patient) return res.status(404).json({ message: "Patient not found" })
 
    if (patient.uploadId) {
      const totalInUpload = await Patient.countDocuments({ uploadId: patient.uploadId })
      const confirmedInUpload = await Patient.countDocuments({ uploadId: patient.uploadId, status: "confirmed" })
      if (totalInUpload > 0 && totalInUpload === confirmedInUpload) {
        await Upload.findByIdAndUpdate(patient.uploadId, { status: "confirmed" }, { new: true })
      }
    }
 
    // Pass emailOverrideDate — if patient had a DCR, this is the new approved date.
    // If no DCR, emailOverrideDate is null and sendConfirmationEmailForPatient
    // falls back to patient.appointmentDate which is already correct.
    await sendConfirmationEmailForPatient(patient, emailOverrideDate)
 
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

exports.requestDateChange = async (req, res) => {
  try {
    const { requestedDate, requestedBy, requestedByName } = req.body
    if (!requestedDate) return res.status(400).json({ message: "requestedDate is required" })
    if (!["hr", "employee"].includes(requestedBy)) {
      return res.status(400).json({ message: "requestedBy must be 'hr' or 'employee'" })
    }

    const patient = await Patient.findById(req.params.patientId)
    if (!patient) return res.status(404).json({ message: "Patient not found" })

    if (patient.appointmentDate) {
      const hoursUntilAppointment = (new Date(patient.appointmentDate) - new Date()) / (1000 * 60 * 60)
      if (hoursUntilAppointment < 48) {
        return res.status(400).json({ message: "Cannot request date change — appointment is less than 48 hours away" })
      }
    }

    const hoursUntilRequested = (new Date(requestedDate) - new Date()) / (1000 * 60 * 60)
    if (hoursUntilRequested < 48) {
      return res.status(400).json({ message: "Requested date must be at least 48 hours from now" })
    }

    patient.status = "pending"
    patient.assignedCenterId = null
    patient.dateChangeRequest = {
      requestedDate: new Date(requestedDate),
      requestedBy,
      requestedByName: requestedByName || requestedBy,
      status: "pending",
      requestedAt: new Date()
    }
    await patient.save()

    try {
      const { sendDateChangeNotification } = require("../utils/emailService")
      if (patient.email && requestedBy === "hr") {
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

exports.getDateChangeRequests = async (req, res) => {
  try {
    const patients = await Patient
      .find({
        status: "pending",
        "dateChangeRequest.status": "pending"
      })
      .populate("assignedCenterId", "name phone address pincode")
      .populate("companyId", "name")
      .sort({ "dateChangeRequest.requestedAt": -1 })
    res.json(patients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.reviewDateChange = async (req, res) => {
  try {
    const { action, centerId } = req.body
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "action must be 'approve' or 'reject'" })
    }
 
    const patient = await Patient.findById(req.params.patientId)
    if (!patient) return res.status(404).json({ message: "Patient not found" })
    if (!patient.dateChangeRequest || patient.dateChangeRequest.status !== "pending") {
      return res.status(400).json({ message: "No pending date change request found" })
    }
 
    // ── DEBUG: log raw values from DB before any processing ──────────────────
    console.log("=== reviewDateChange DEBUG ===")
    console.log("patient.appointmentDate raw:", patient.appointmentDate)
    console.log("patient.dateChangeRequest.requestedDate raw:", patient.dateChangeRequest.requestedDate)
    console.log("patient.dateChangeRequest.requestedBy:", patient.dateChangeRequest.requestedBy)
    console.log("patient.dateChangeRequest.status:", patient.dateChangeRequest.status)
    console.log("action:", action)
    console.log("centerId:", centerId)
    // ─────────────────────────────────────────────────────────────────────────
 
    const previousDate = patient.appointmentDate
      ? new Date(
          patient.appointmentDate instanceof Date
            ? patient.appointmentDate.toISOString()
            : patient.appointmentDate
        )
      : null
 
    const requestedDate = new Date(
      patient.dateChangeRequest.requestedDate instanceof Date
        ? patient.dateChangeRequest.requestedDate.toISOString()
        : patient.dateChangeRequest.requestedDate
    )
 
    // ── DEBUG: log captured values after conversion ───────────────────────────
    console.log("previousDate after conversion:", previousDate)
    console.log("requestedDate after conversion:", requestedDate)
    console.log("requestedDate.toLocaleDateString en-IN:", requestedDate.toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric"
    }))
    // ─────────────────────────────────────────────────────────────────────────
 
    const requestedBy = patient.dateChangeRequest.requestedBy
    const companyId = patient.companyId
 
    if (action === "approve") {
      const hoursUntilNew = (requestedDate - new Date()) / (1000 * 60 * 60)
      if (hoursUntilNew < 48) {
        return res.status(400).json({ message: "Cannot approve — requested date is less than 48 hours away" })
      }
 
      const updateDoc = {
        appointmentDate: requestedDate,
        "dateChangeRequest.status": "approved"
      }
      if (centerId) {
        updateDoc.assignedCenterId = centerId
        updateDoc.status = "confirmed"
      }
 
      await Patient.findByIdAndUpdate(req.params.patientId, { $set: updateDoc })
 
    } else {
      await Patient.findByIdAndUpdate(
        req.params.patientId,
        { $set: { "dateChangeRequest.status": "rejected", status: "rejected", assignedCenterId: null } }
      )
    }
 
    const populated = await Patient
      .findById(req.params.patientId)
      .populate("assignedCenterId", "name phone address pincode")
      .populate("companyId", "name")
 
    // ── DEBUG: log what populated has after DB update ─────────────────────────
    console.log("populated.appointmentDate after update:", populated.appointmentDate)
    console.log("=== END DEBUG ===")
    // ─────────────────────────────────────────────────────────────────────────
 
    try {
      const { sendDateChangeNotification, sendRejectionEmail } = require("../utils/emailService")
      const User = require("../models/User")
 
      if (action === "approve") {
        await sendConfirmationEmailForPatient(populated, requestedDate)
 
        const hrUser = await User.findOne({ role: "hr", companyId })
        if (hrUser) {
          await sendDateChangeNotification({
            toEmail: hrUser.email,
            recipientName: hrUser.name,
            employeeName: populated.name,
            currentDate: previousDate,
            requestedDate,
            action: "approved",
            requestedBy
          })
        }
 
      } else {
        if (populated.email) {
          await sendRejectionEmail({
            toEmail: populated.email,
            employeeName: populated.name,
            companyName: populated.companyId?.name || "Your Company"
          })
        }
 
        const hrUser = await User.findOne({ role: "hr", companyId })
        if (hrUser) {
          await sendDateChangeNotification({
            toEmail: hrUser.email,
            recipientName: hrUser.name,
            employeeName: populated.name,
            currentDate: previousDate,
            requestedDate,
            action: "rejected",
            requestedBy
          })
        }
      }
    } catch (emailErr) {
      console.error("Email failed:", emailErr.message)
    }
 
    res.json({ message: `Date change ${action}d`, patient: populated })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
 
// ─── Reports ──────────────────────────────────────────────────────────────────

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
    try {
      const { sendReportUploadEmail } = require("../utils/emailService")
      const populatedPatient = await Patient.findById(req.params.patientId).populate("companyId")
      if (populatedPatient.email) {
        await sendReportUploadEmail({
          toEmail: populatedPatient.email,
          employeeName: populatedPatient.name,
          companyName: populatedPatient.companyId?.name || "Company",
          reportUrl: reportEntry.url
        })
      }
    } catch (emailErr) {
      console.log("Report email error:", emailErr.message)
    }
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
    const { patientId } = req.params
    if (!patientId) return res.status(400).json({ message: "Patient ID is required" })

    const patient = await Patient.findById(patientId).populate("companyId")
    if (!patient) return res.status(404).json({ message: "Patient not found" })

    patient.status = "rejected"
    patient.assignedCenterId = null

    if (patient.dateChangeRequest && patient.dateChangeRequest.status === "pending") {
      patient.dateChangeRequest.status = "rejected"
    }

    await patient.save()

    try {
      const { sendRejectionEmail } = require("../utils/emailService")
      if (patient.email) {
        await sendRejectionEmail({
          toEmail: patient.email,
          employeeName: patient.name,
          companyName: patient.companyId?.name || "Your Company"
        })
      }
    } catch (emailErr) {
      console.error("Rejection email failed:", emailErr.message)
    }

    res.json(patient)
  } catch (error) {
    console.error("Reject error:", error)
    res.status(500).json({ message: error.message })
  }
}