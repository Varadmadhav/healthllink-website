const Upload = require("../models/Upload")
const Patient = require("../models/Patient")
const XLSX = require("xlsx")

exports.uploadExcel = async (req, res) => {

  try {

    const workbook = XLSX.read(req.file.buffer)

    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    const data = XLSX.utils.sheet_to_json(sheet)

    const patients = data.map(row => ({
      name: row.Name,
      gender: row.Gender,
      age: row.Age,
      address: row.Address,
      pincode: row.Pincode,
      mobile: row.Mobile,
      email: row.Email,
      status: "Pending"
    }))

    await Patient.insertMany(patients)

   const upload = new Upload({
  fileName: req.file.originalname,
  recordsCount: patients.length,
  status: "processed"
})

    await upload.save()

    res.json({
      message: "Upload successful",
      records: patients.length
    })

  } catch (error) {

    res.status(500).json({ message: error.message })

  }

}


exports.getUploads = async (req, res) => {

  try {

    const uploads = await Upload.find().sort({ uploadedAt: -1 })

    res.json(uploads)

  } catch (error) {

    res.status(500).json({ message: error.message })

  }

}