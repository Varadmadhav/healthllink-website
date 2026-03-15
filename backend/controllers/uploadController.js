const Upload = require("../models/Upload")
const Patient = require("../models/Patient")
const XLSX = require("xlsx")

// Helper: parse Excel date values
// Excel stores dates as serial numbers — XLSX.utils.sheet_to_json with raw:false
// gives us strings, but raw:true gives numbers. We handle both.
function parseExcelDate(value) {
  if (!value) return null

  // If it's already a JS Date
  if (value instanceof Date) return value

  // If it's a number (Excel serial date)
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value)
    if (date) return new Date(date.y, date.m - 1, date.d)
  }

  // If it's a string like "2025-08-15" or "15/08/2025"
  if (typeof value === "string") {
    const parsed = new Date(value)
    if (!isNaN(parsed.getTime())) return parsed

    // Try DD/MM/YYYY
    const parts = value.split("/")
    if (parts.length === 3) {
      const [d, m, y] = parts
      const parsed2 = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`)
      if (!isNaN(parsed2.getTime())) return parsed2
    }
  }

  return null
}

exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })

    // Read with raw:true so dates come as Excel serial numbers (most accurate)
    const workbook = XLSX.read(req.file.buffer, { type: "buffer", cellDates: true })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    // cellDates:true makes XLSX parse date cells directly into JS Date objects
    const data = XLSX.utils.sheet_to_json(sheet, { raw: false, dateNF: "yyyy-mm-dd" })

    const uploadHistory = new Upload({
      fileName: req.file.originalname,
      recordsCount: data.length,
      uploadedAt: new Date(),
      status: "pending",
      companyId: req.user?.companyId,
      uploadedBy: req.user?._id
    })

    await uploadHistory.save()

    const patients = data.map(row => {
      // Read date from the row's "Date" column — per employee
      const rawDate = row["Date"] || row["date"] || row["DATE"] ||
                      row["Appointment Date"] || row["appointment date"]
      const appointmentDate = parseExcelDate(rawDate)

      return {
        uploadId: uploadHistory._id,
        companyId: req.user?.companyId || null,
        name: row.Name || row.name || row["Patient Name"],
        gender: row.Gender || row.gender,
        age: row.Age || row.age,
        phone: row.Mobile || row.mobile || row.Phone || row.phone || row["Phone Number"],
        email: row.Email || row.email,
        address: row.Address || row.address,
        pincode: row.Pincode || row.pincode,
        appointmentDate: appointmentDate,   // per-row date, not global
        status: "pending"
      }
    })

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