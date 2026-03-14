const Company = require("../models/Company")
const Center = require("../models/Center")
const Upload = require("../models/Upload")
const Patient = require("../models/Patient")
const { getCoordinatesForPincode, haversineDistance } = require("../utils/pincodeUtils")

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

// POST /api/admin/centers
// Auto-populates lat/lng from local pincode data when saving a new centre
exports.addCenter = async (req, res) => {
  try {
    const { name, email, phone, address, pincode } = req.body

    let latitude = null
    let longitude = null

    if (pincode) {
      const coords = getCoordinatesForPincode(pincode)
      if (coords) {
        latitude = coords.lat
        longitude = coords.lng
      }
    }

    const center = new Center({ name, email, phone, address, pincode, latitude, longitude })
    await center.save()
    res.status(201).json(center)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/admin/centers
exports.getCenters = async (req, res) => {
  try {
    const centers = await Center.find()
    res.json(centers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/admin/centers/nearby?pincode=560001&limit=3
// Returns centres sorted by real straight-line distance using local pincode data.
// Completely synchronous — no external API calls.
exports.getNearbyCenters = async (req, res) => {
  try {
    const { pincode, limit = 3 } = req.query

    if (!pincode) {
      return res.status(400).json({ message: "pincode query param is required" })
    }

    const allCenters = await Center.find()

    if (allCenters.length === 0) return res.json([])

    // Get coordinates for the employee pincode
    const empCoords = getCoordinatesForPincode(pincode)

    if (empCoords) {
      const centersWithDistance = allCenters.map((c) => {
        // Use stored coordinates if available, otherwise look up from local data
        let centerCoords = null

        if (c.latitude && c.longitude) {
          centerCoords = { lat: c.latitude, lng: c.longitude }
        } else if (c.pincode) {
          centerCoords = getCoordinatesForPincode(c.pincode)
        }

        const distance = centerCoords
          ? haversineDistance(empCoords.lat, empCoords.lng, centerCoords.lat, centerCoords.lng)
          : 99999

        return {
          _id: c._id,
          name: c.name,
          phone: c.phone || "",
          email: c.email || "",
          address: c.address || "",
          pincode: c.pincode || "",
          distance: Math.round(distance * 10) / 10
        }
      })

      const sorted = centersWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, parseInt(limit))

      return res.json(sorted)
    }

    // Fallback — pincode not in dataset at all, return first N centres
    const fallback = allCenters.slice(0, parseInt(limit)).map(c => ({
      _id: c._id,
      name: c.name,
      phone: c.phone || "",
      email: c.email || "",
      address: c.address || "",
      pincode: c.pincode || "",
      distance: null
    }))

    res.json(fallback)
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
        const pendingCount = await Patient.countDocuments({
          uploadId: u._id,
          assignedCenterId: null
        })
        const confirmedCount = await Patient.countDocuments({
          uploadId: u._id,
          assignedCenterId: { $ne: null }
        })
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
    const upload = await Upload.findByIdAndUpdate(
      req.params.id, { status: "approved" }, { new: true }
    )
    await Patient.updateMany({ uploadId: req.params.id }, { status: "approved" })
    res.json(upload)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.rejectUpload = async (req, res) => {
  try {
    const upload = await Upload.findByIdAndUpdate(
      req.params.id, { status: "rejected" }, { new: true }
    )
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
    ).populate("assignedCenterId", "name phone address pincode")

    if (!patient) return res.status(404).json({ message: "Patient not found" })
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

// ─── Reports ─────────────────────────────────────────────────────────────────

// POST /api/admin/patients/:patientId/report
// Pushes a new entry into the reportUrls array — supports multiple reports per patient
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