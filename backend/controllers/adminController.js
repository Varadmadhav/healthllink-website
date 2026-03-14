const Company = require("../models/Company")
const Center = require("../models/Center")
const Upload = require("../models/Upload")
const Patient = require("../models/Patient")
const path = require("path")
const fs = require("fs")

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
    const center = new Center(req.body)
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

// ─── Uploads ─────────────────────────────────────────────────────────────────

// GET /api/admin/uploads  — all upload batches with pending/confirmed counts
exports.getUploads = async (req, res) => {
  try {
    const uploads = await Upload
      .find()
      .populate("companyId", "name")
      .populate("uploadedBy", "name")
      .sort({ uploadedAt: -1 })

    // attach per-upload patient counts so the grid cards can show them
    const uploadsWithCounts = await Promise.all(
      uploads.map(async (u) => {
        const pendingCount = await Patient.countDocuments({
          uploadId: u._id,
          status: { $in: ["pending", "approved"] },
          assignedCenterId: null
        })
        const confirmedCount = await Patient.countDocuments({
          uploadId: u._id,
          assignedCenterId: { $ne: null }
        })
        return {
          ...u.toObject(),
          pendingCount,
          confirmedCount
        }
      })
    )

    res.json(uploadsWithCounts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/admin/uploads/:uploadId/patients  — patients for one upload batch
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

// PUT /api/admin/uploads/:id/approve
exports.approveUpload = async (req, res) => {
  try {
    const upload = await Upload.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    )
    await Patient.updateMany(
      { uploadId: req.params.id },
      { status: "approved" }
    )
    res.json(upload)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/admin/uploads/:id/reject
exports.rejectUpload = async (req, res) => {
  try {
    const upload = await Upload.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    )
    await Patient.updateMany(
      { uploadId: req.params.id },
      { status: "rejected" }
    )
    res.json(upload)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─── Confirmation ────────────────────────────────────────────────────────────

// PUT /api/admin/patients/:patientId/assign
// Body: { centerId }
exports.assignCenter = async (req, res) => {
  try {
    const { centerId } = req.body
    if (!centerId) {
      return res.status(400).json({ message: "centerId is required" })
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.patientId,
      {
        assignedCenterId: centerId,
        status: "confirmed"
      },
      { new: true }
    ).populate("assignedCenterId", "name phone address pincode")

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }

    res.json(patient)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/admin/patients  — all confirmed patients (for Make Confirmation tab)
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

// POST /api/admin/patients/:patientId/report  — upload a PDF report
// Uses multer (configured in the route) — file saved to /uploads/reports/
exports.uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    // Store a relative URL path the frontend can use to download
    const reportUrl = `/uploads/reports/${req.file.filename}`

    const patient = await Patient.findByIdAndUpdate(
      req.params.patientId,
      { reportUrl },
      { new: true }
    )

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }

    res.json({ reportUrl, patient })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}