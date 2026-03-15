const Company = require("../models/Company")
const Center = require("../models/Center")
const Upload = require("../models/Upload")
const Patient = require("../models/Patient")
const { getCoordinatesForPincode, haversineDistance } = require("../utils/pincodeUtils")
const fs = require("fs")
const path = require("path")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const { sendConfirmationEmail } = require("../utils/emailService")

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
        const pendingCount = await Patient.countDocuments({ uploadId: u._id, assignedCenterId: null })
        const confirmedCount = await Patient.countDocuments({ uploadId: u._id, assignedCenterId: { $ne: null } })
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

    if (patient.uploadId) {
      const totalInUpload = await Patient.countDocuments({ uploadId: patient.uploadId })
      const confirmedInUpload = await Patient.countDocuments({
        uploadId: patient.uploadId,
        assignedCenterId: { $ne: null }
      })
      if (totalInUpload > 0 && totalInUpload === confirmedInUpload) {
        await Upload.findByIdAndUpdate(patient.uploadId, { status: "confirmed" }, { new: true })
      }
    }

    if (patient.email) {
      const companyName = patient.companyId?.name || "Your Company"
      const centerName = patient.assignedCenterId?.name || "N/A"
      const centerAddress = patient.assignedCenterId?.address || "N/A"
      const appointmentDate = patient.appointmentDate
        ? new Date(patient.appointmentDate).toDateString()
        : "To be announced"

      let isExistingUser = false
      let tempPassword = null

     // REPLACE WITH:
// Only match by email — never match HR/admin users by patientId
      const existingUser = await User.findOne({
        email: patient.email,
        role:  "employee"       // ← only match employee accounts
      })

      if (!existingUser) {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#"
        tempPassword = Array.from(
          { length: 10 },
          () => chars[Math.floor(Math.random() * chars.length)]
        ).join("")

        const hashedPassword = await bcrypt.hash(tempPassword, 12)

        try {
          await User.create({
            name:                patient.name,
            email:               patient.email,
            password:            hashedPassword,
            role:                "employee",
            companyId:           patient.companyId?._id || null,
            patientId:           patient._id,
            phone:               patient.phone || "",
            address:             patient.address || "",
            pincode:             patient.pincode || "",
            isTemporaryPassword: true,
          })
        } catch (createErr) {
          console.warn("User already exists:", createErr.message)
          isExistingUser = true
          tempPassword = null
        }

      } else {
        isExistingUser = true
        if (!existingUser.patientId) {
          existingUser.patientId = patient._id
          await existingUser.save()
        }
      }

      try {
        await sendConfirmationEmail({
          toEmail:         patient.email,
          employeeName:    patient.name,
          companyName,
          centerName,
          centerAddress,
          appointmentDate,
          loginId:         patient.email,
          tempPassword,
          isExistingUser,
        })
      } catch (emailErr) {
        console.error("❌ Email failed:", emailErr.message)
      }
    }

    res.json(patient)
  } catch (error) {
    console.error("❌ assignCenter error:", error.message)
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
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    res.json({ message: "Report deleted", patient })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─── Reschedule ──────────────────────────────────────────────────────────────

exports.approveReschedule = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId)
      .populate("companyId", "name")
      .populate("assignedCenterId", "name address")

    if (!patient) return res.status(404).json({ message: "Patient not found" })

    if (patient.rescheduleStatus !== "requested") {
      return res.status(400).json({ message: "No pending reschedule request" })
    }

    patient.appointmentDate = patient.rescheduleRequestDate
    patient.rescheduleRequestDate = null
    patient.rescheduleStatus = "approved"
    await patient.save()

    if (patient.email) {
      try {
        await sendConfirmationEmail({
          toEmail:            patient.email,
          employeeName:       patient.name,
          companyName:        patient.companyId?.name || "Your Company",
          centerName:         patient.assignedCenterId?.name || "N/A",
          centerAddress:      patient.assignedCenterId?.address || "N/A",
          appointmentDate:    new Date(patient.appointmentDate).toDateString(),
          loginId:            patient.email,
          tempPassword:       null,
          isExistingUser:     true,
          isReschedule:       true,
          rescheduleApproved: true,
        })
      } catch (emailErr) {
        console.error("Reschedule approval email failed:", emailErr.message)
      }
    }

    res.json({ message: "Reschedule approved", patient })

  } catch (error) {
    console.error("❌ approveReschedule error:", error.message)
    res.status(500).json({ message: error.message })
  }
}

exports.rejectReschedule = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId)
      .populate("companyId", "name")
      .populate("assignedCenterId", "name address")

    if (!patient) return res.status(404).json({ message: "Patient not found" })

    if (patient.rescheduleStatus !== "requested") {
      return res.status(400).json({ message: "No pending reschedule request" })
    }

    patient.rescheduleRequestDate = null
    patient.rescheduleStatus = "rejected"
    await patient.save()

    if (patient.email) {
      try {
        await sendConfirmationEmail({
          toEmail:            patient.email,
          employeeName:       patient.name,
          companyName:        patient.companyId?.name || "Your Company",
          centerName:         patient.assignedCenterId?.name || "N/A",
          centerAddress:      patient.assignedCenterId?.address || "N/A",
          appointmentDate:    new Date(patient.appointmentDate).toDateString(),
          loginId:            patient.email,
          tempPassword:       null,
          isExistingUser:     true,
          isReschedule:       true,
          rescheduleApproved: false,
        })
      } catch (emailErr) {
        console.error("Reschedule rejection email failed:", emailErr.message)
      }
    }

    res.json({ message: "Reschedule rejected", patient })

  } catch (error) {
    console.error("❌ rejectReschedule error:", error.message)
    res.status(500).json({ message: error.message })
  }
}