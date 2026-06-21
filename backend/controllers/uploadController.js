const Upload = require("../models/Upload")
const Patient = require("../models/Patient")
const Profile = require("../models/Profile")
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

function normalizeProfileName(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "")
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

    // Fetch all dynamic profiles from MongoDB Atlas
    const dbProfiles = await Profile.find()

    const patients = data.map((row, index) => {
      const rawDate = row["Date"] || row["date"] || row["DATE"] ||
                      row["Joining Date"] || row["joining date"]
      const joiningDate = parseExcelDate(rawDate)

      const employeeId = String(row["Employee ID"] || row["employee id"] || row["EmployeeId"] || row["employeeId"] || "").trim()
      const rawProfile = row["Test Profile"] || row["test profile"] || row["TestProfile"] || row["testProfile"] || ""
      
      const normalizedRaw = normalizeProfileName(rawProfile)
      let matchedProfile = dbProfiles.find(p => normalizeProfileName(p.name) === normalizedRaw)

      let testProfileName = ""
      let tests = []
      let fastingRequired = false

      if (rawProfile.trim()) {
        if (matchedProfile) {
          testProfileName = matchedProfile.name
          tests = matchedProfile.tests
          fastingRequired = matchedProfile.fastingRequired
        } else {
          // Fallback regex check for backward compatibility (e.g. "Profile 1" -> "Pre employment Profile-1")
          const normalized = String(rawProfile).trim().replace(/\s+/g, " ")
          let fallbackKey = null
          if (/profile-?1/i.test(normalized)) {
            fallbackKey = "preemploymentprofile1"
          } else if (/profile-?2/i.test(normalized)) {
            fallbackKey = "preemploymentprofile2"
          } else if (/profile-?3/i.test(normalized)) {
            fallbackKey = "preemploymentprofile3"
          }

          if (fallbackKey) {
            matchedProfile = dbProfiles.find(p => normalizeProfileName(p.name) === fallbackKey)
          }

          if (matchedProfile) {
            testProfileName = matchedProfile.name
            tests = matchedProfile.tests
            fastingRequired = matchedProfile.fastingRequired
          } else {
            testProfileName = String(rawProfile).trim()
            tests = []
            fastingRequired = false
          }
        }
      } else {
        testProfileName = "General Health Checkup"
        tests = ["Standard Physical Exam"]
        fastingRequired = false
      }

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
        testProfile: testProfileName,
        tests: tests,
        fastingRequired: fastingRequired
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