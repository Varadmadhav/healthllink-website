const xlsx = require("xlsx");
const Upload = require("../models/Upload");
const Patient = require("../models/Patient");
const mongoose = require("mongoose");

// ================================
// Upload Excel and create patients
// ================================
exports.uploadExcel = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const { companyId, userId, appointmentDate } = req.body;

    // Validate required fields
    if (!companyId || !userId || !appointmentDate) {
      return res.status(400).json({
        message: "companyId, userId and appointmentDate are required"
      });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid companyId" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // =====================
    // Read Excel file
    // =====================
    const workbook = xlsx.readFile(filePath);

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return res.status(400).json({
        message: "Excel file is empty"
      });
    }

    // =====================
    // Save upload history
    // =====================
    const upload = new Upload({
      companyId: new mongoose.Types.ObjectId(companyId),
      uploadedBy: new mongoose.Types.ObjectId(userId),
      fileName: req.file.filename,
      recordsCount: data.length,
      appointmentDate: new Date(appointmentDate)
    });

    await upload.save();

    // =====================
    // Convert Excel rows to patients
    // =====================
    const patients = data.map((row) => ({

      uploadId: upload._id,

      companyId: new mongoose.Types.ObjectId(companyId),

      name: row.Name || "",

      gender: row.Gender || "",

      age: row.Age ? Number(row.Age) : null,

      date: row.Date ? new Date(row.Date) : null,

      appointmentDate: new Date(appointmentDate),

      address: row.Address || "",

      pincode: row.Pincode || "",

      phone: row.Mobile || "",

      email: row.Email || "",

      status: "pending"

    }));

    // =====================
    // Insert patients
    // =====================
    await Patient.insertMany(patients);

    res.json({
      message: "Excel uploaded successfully",
      uploadId: upload._id,
      recordsInserted: patients.length
    });

  } catch (error) {

    console.error("Excel Upload Error:", error);

    res.status(500).json({
      message: "Error uploading Excel",
      error: error.message
    });

  }

};


// ================================
// Get Upload History
// ================================
exports.getUploadHistory = async (req, res) => {

  try {

    const companyId = req.query.companyId;

    if (!companyId) {
      return res.status(400).json({
        message: "companyId is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid companyId"
      });
    }

    const uploads = await Upload.find({
      companyId: new mongoose.Types.ObjectId(companyId)
    })
      .populate("companyId", "name")
      .sort({ createdAt: -1 });

    res.json(uploads);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};