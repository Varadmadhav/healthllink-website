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

    const companyId = req.user?.companyId || null
    let newCount = 0
    let updatedCount = 0
    const now = new Date()

    for (const row of data) {
      const rawDate = row["Date"] || row["date"] || row["DATE"] ||
                      row["Appointment Date"] || row["appointment date"]
      const appointmentDate = parseExcelDate(rawDate)
      const email = row.Email || row.email
      const name = row.Name || row.name || row["Patient Name"]

      // BUG 4 FIX: Check if this employee already exists for this company
      const existingPatient = email
        ? await Patient.findOne({ email, companyId })
        : null

      if (existingPatient) {
        // Employee already exists — archive old appointment if it hasn't passed yet
        const oldDate = existingPatient.appointmentDate
        const oldAppointmentIsFuture = oldDate && new Date(oldDate) > now

        if (oldAppointmentIsFuture) {
          // Push the current appointment into pastAppointments before overwriting
          await Patient.findByIdAndUpdate(existingPatient._id, {
            $push: {
              pastAppointments: {
                appointmentDate: oldDate,
                assignedCenterId: existingPatient.assignedCenterId || null,
                status: existingPatient.status,
                uploadId: existingPatient.uploadId || null,
                archivedAt: now
              }
            }
          })
        }

        // Update existing record with new appointment details, reset to pending
        await Patient.findByIdAndUpdate(existingPatient._id, {
          $set: {
            uploadId: uploadHistory._id,
            name: name || existingPatient.name,
            gender: row.Gender || row.gender || existingPatient.gender,
            age: row.Age || row.age || existingPatient.age,
            phone: row.Mobile || row.mobile || row.Phone || row.phone ||
                   row["Phone Number"] || existingPatient.phone,
            address: row.Address || row.address || existingPatient.address,
            pincode: row.Pincode || row.pincode || existingPatient.pincode,
            appointmentDate: appointmentDate || existingPatient.appointmentDate,
            status: "pending",
            assignedCenterId: null,
            // Clear stale date change request from previous cycle
            "dateChangeRequest.status": null,
            "dateChangeRequest.requestedDate": null,
            "dateChangeRequest.requestedBy": null,
            "dateChangeRequest.requestedByName": null,
            "dateChangeRequest.requestedAt": null
          }
        })

        updatedCount++
      } else {
        // Brand new employee — create fresh record
        await Patient.create({
          uploadId: uploadHistory._id,
          companyId,
          name,
          gender: row.Gender || row.gender,
          age: row.Age || row.age,
          phone: row.Mobile || row.mobile || row.Phone || row.phone || row["Phone Number"],
          email,
          address: row.Address || row.address,
          pincode: row.Pincode || row.pincode,
          appointmentDate,
          status: "pending"
        })
        newCount++
      }
    }

    res.json({
      message: "Upload successful",
      records: data.length,
      newEmployees: newCount,
      updatedEmployees: updatedCount
    })
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