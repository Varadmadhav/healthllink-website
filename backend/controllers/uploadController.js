const Upload = require("../models/Upload")
const Patient = require("../models/Patient")
const XLSX = require("xlsx")

exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })

    const { appointmentDate } = req.body
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet)

    const uploadHistory = new Upload({
      fileName: req.file.originalname,
      recordsCount: data.length,
      uploadedAt: new Date(),
      status: "pending",
      companyId: req.user?.companyId,
      uploadedBy: req.user?._id
    })

    await uploadHistory.save()

    const patients = data.map(row => ({
      uploadId: uploadHistory._id,
      companyId: req.user?.companyId || null,
      name: row.Name || row.name || row["Patient Name"],
      gender: row.Gender || row.gender,
      age: row.Age || row.age,
      phone: row.Mobile || row.mobile || row.Phone || row.phone || row["Phone Number"],
      email: row.Email || row.email,
      address: row.Address || row.address,
      pincode: row.Pincode || row.pincode,
      appointmentDate: appointmentDate || null,
      status: "pending"
    }))

    await Patient.insertMany(patients)

    res.json({ message: "Upload successful", records: patients.length })
  } catch (error) {
    console.error("Upload Controller Error:", error)
    res.status(500).json({ message: error.message })
  }
}

// Fetch upload history for the logged-in HR's company
exports.getUploads = async (req, res) => {
  try {
    const companyId = req.user?.companyId || null
    const uploads = await Upload
      .find({ companyId })
      .sort({ uploadedAt: -1 })
    res.json(uploads)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Fetch all patients for this company
// Populated: assignedCenterId (name, phone) and reportUrls so HR can see them
exports.getPatients = async (req, res) => {
  try {
    const companyId = req.user?.companyId || null
    const patients = await Patient
      .find({ companyId })
      .populate("assignedCenterId", "name phone address pincode")
      .sort({ createdAt: -1 })
    res.json(patients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Fetch patients for a specific upload batch
exports.getPatientsByUpload = async (req, res) => {
  try {
    const { uploadId } = req.params
    const companyId = req.user?.companyId || null
    const patients = await Patient
      .find({ uploadId, companyId })
      .populate("assignedCenterId", "name phone address pincode")
    res.json(patients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}