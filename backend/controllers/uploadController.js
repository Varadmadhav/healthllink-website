const Upload = require("../models/Upload")
const Patient = require("../models/Patient")
const XLSX = require("xlsx")

function parseExcelDate(value) {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value)
    if (date) return new Date(date.y, date.m - 1, date.d)
  }
  if (typeof value === "string") {
    const parsed = new Date(value)
    if (!isNaN(parsed.getTime())) return parsed
    const parts = value.split("/")
    if (parts.length === 3) {
      const [d, m, y] = parts
      const parsed2 = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`)
      if (!isNaN(parsed2.getTime())) return parsed2
    }
  }
  return null
}

const TEST_PROFILES = {
  "Pre employment Profile-1": {
    tests: ["Complete Blood Count (CBC)", "Urine Routine", "Blood Sugar Fasting", "ECG"],
    fastingRequired: true
  },
  "Pre employment Profile-2": {
    tests: ["Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile (T3, T4, TSH)"],
    fastingRequired: true
  },
  "Pre employment Profile-3": {
    tests: ["Blood Group & Rh typing", "Chest X-Ray", "Eye Test"],
    fastingRequired: false
  }
}

function getProfileData(profileName) {
  if (!profileName) {
    return {
      name: "General Health Checkup",
      tests: ["Standard Physical Exam"],
      fastingRequired: false
    }
  }

  const normalized = String(profileName).trim().replace(/\s+/g, " ")
  
  if (/profile-?1/i.test(normalized)) {
    return {
      name: "Pre employment Profile-1",
      ...TEST_PROFILES["Pre employment Profile-1"]
    }
  }
  if (/profile-?2/i.test(normalized)) {
    return {
      name: "Pre employment Profile-2",
      ...TEST_PROFILES["Pre employment Profile-2"]
    }
  }
  if (/profile-?3/i.test(normalized)) {
    return {
      name: "Pre employment Profile-3",
      ...TEST_PROFILES["Pre employment Profile-3"]
    }
  }

  return {
    name: normalized,
    tests: ["General Medical Evaluation"],
    fastingRequired: false
  }
}

exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })

    const workbook = XLSX.read(req.file.buffer, { type: "buffer", cellDates: true })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
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

    const now = new Date()
    const yy = String(now.getFullYear()).substring(2, 4)
    const mm = String(now.getMonth() + 1).padStart(2, "0")
    const prefix = `${yy}${mm}00P`

    const lastPatient = await Patient.findOne({
      patientIdString: { $regex: new RegExp(`^${prefix}`) }
    }).sort({ patientIdString: -1 })

    let startSeq = 1
    if (lastPatient && lastPatient.patientIdString) {
      const seqStr = lastPatient.patientIdString.replace(prefix, "")
      const seqNum = parseInt(seqStr, 10)
      if (!isNaN(seqNum)) {
        startSeq = seqNum + 1
      }
    }

    const companyId = req.user?.companyId || null

    const patients = data.map((row, index) => {
      const rawDate = row["Date"] || row["date"] || row["DATE"] ||
                      row["Joining Date"] || row["joining date"]
      const joiningDate = parseExcelDate(rawDate)

      const employeeId = String(row["Employee ID"] || row["employee id"] || row["EmployeeId"] || row["employeeId"] || "").trim()
      const rawProfile = row["Test Profile"] || row["test profile"] || row["TestProfile"] || row["testProfile"] || ""
      const profileData = getProfileData(rawProfile)

      const currentSeq = startSeq + index
      const patientIdString = `${prefix}${String(currentSeq).padStart(2, "0")}`

      return {
        uploadId: uploadHistory._id,
        companyId,
        name: row.Name || row.name || row["Patient Name"],
        gender: row.Gender || row.gender,
        age: row.Age || row.age,
        phone: row.Mobile || row.mobile || row.Phone || row.phone || row["Phone Number"],
        email: row.Email || row.email,
        address: row.Address || row.address,
        pincode: row.Pincode || row.pincode,
        joiningDate,
        appointmentDate: null,
        status: "pending",
        employeeId,
        patientIdString,
        testProfile: profileData.name,
        tests: profileData.tests,
        fastingRequired: profileData.fastingRequired
      }
    })

    await Patient.insertMany(patients)

    res.json({ message: "Upload successful", records: patients.length })
  } catch (error) {
    console.error("Upload Controller Error:", error)
    res.status(500).json({ message: error.message })
  }
}

exports.getUploads = async (req, res) => {
  try {
    const companyId = req.user?.companyId || null
    const uploads = await Upload.find({ companyId }).sort({ uploadedAt: -1 })
    res.json(uploads)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

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