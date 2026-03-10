const Upload = require("../models/Upload");
const Patient = require("../models/Patient");
const XLSX = require("xlsx");

// 1. Handle Excel Upload & Parsing
exports.uploadExcel = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { appointmentDate } = req.body;

    const companyId = req.user?.companyId || null;
    const userId = req.user?.id || null;

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet);

    const patients = data.map(row => ({

  uploadId: null,

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

}));

    await Patient.insertMany(patients);

    const existingUpload = await Upload.findOne({
      fileName: req.file.originalname,
      companyId: companyId
    });

    if (existingUpload) {

      existingUpload.recordsCount = patients.length;
      existingUpload.uploadedAt = new Date();
      existingUpload.status = "processed";

      await existingUpload.save();

    } else {

      const uploadHistory = new Upload({
        companyId: companyId,
        uploadedBy: userId,
        fileName: req.file.originalname,
        recordsCount: patients.length,
        status: "processed",
        uploadedAt: new Date()
      });

      await uploadHistory.save();

    }

    res.json({
      message: "Upload successful",
      records: patients.length
    });

  } catch (error) {

    console.error("Upload Controller Error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};


// 2. Fetch Upload History
exports.getUploads = async (req, res) => {
  try {

    const companyId = req.user?.companyId || null;

    const uploads = await Upload.find({
      companyId: companyId
    })
      .sort({ uploadedAt: -1 });

    res.json(uploads);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// 3. Fetch All Patients
exports.getPatients = async (req, res) => {
  try {

    const patients = await Patient.find()
      .sort({ createdAt: -1 });

    res.json(patients);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};