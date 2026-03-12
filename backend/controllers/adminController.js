const Company = require("../models/Company")
const Center = require("../models/Center")
const Upload = require("../models/Upload")
const Patient = require("../models/Patient")

// Add Company
exports.addCompany = async (req, res) => {
  try {

    const company = new Company(req.body)

    await company.save()

    res.status(201).json(company)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Companies
exports.getCompanies = async (req, res) => {
  try {

    const companies = await Company.find()

    res.json(companies)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Add Center
exports.addCenter = async (req, res) => {
  try {

    const center = new Center(req.body)

    await center.save()

    res.status(201).json(center)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get Centers
exports.getCenters = async (req, res) => {
  try {

    const centers = await Center.find()

    res.json(centers)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all HR Upload Requests
exports.getUploads = async (req, res) => {
  try {

    const uploads = await Upload
      .find()
      .populate("companyId", "name")
      .populate("uploadedBy", "name")

    res.json(uploads)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Approve Upload
exports.approveUpload = async (req, res) => {
  try {

    const uploadId = req.params.id

    const upload = await Upload.findByIdAndUpdate(
      uploadId,
      { status: "approved" },
      { new: true }
    )

    await Patient.updateMany(
      { uploadId: uploadId },
      { status: "approved" }
    )

    res.json(upload)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Reject Upload
exports.rejectUpload = async (req, res) => {
  try {

    const uploadId = req.params.id

    const upload = await Upload.findByIdAndUpdate(
      uploadId,
      { status: "rejected" },
      { new: true }
    )

    await Patient.updateMany(
      { uploadId: uploadId },
      { status: "rejected" }
    )

    res.json(upload)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}