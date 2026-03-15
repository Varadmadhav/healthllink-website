const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// ─── Multer for PDF reports ───────────────────────────────────────────────────
const reportsDir = path.join(__dirname, "../uploads/reports")
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true })

const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, reportsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  }
})

const uploadReport = multer({
  storage: reportStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true)
    else cb(new Error("Only PDF files allowed"))
  }
})

// ─── Controllers ─────────────────────────────────────────────────────────────
const {
  addCompany, getCompanies,
  addCenter, getCenters, getNearbyCenters,
  getUploads, getPatientsByUpload, approveUpload, rejectUpload,
  assignCenter, getAllPatients,
  uploadReport: uploadReportHandler,
  deleteReport,
  approveReschedule,
  rejectReschedule,
  requestDateChange,
  getDateChangeRequests,
  reviewDateChange
} = require("../controllers/adminController")

// ─── Companies ───────────────────────────────────────────────────────────────
router.post("/companies", addCompany)
router.get("/companies", getCompanies)

// ─── Centers ─────────────────────────────────────────────────────────────────
router.post("/centers", addCenter)
router.get("/centers", getCenters)
router.get("/centers/nearby", getNearbyCenters)

// ─── Uploads ─────────────────────────────────────────────────────────────────
router.get("/uploads", getUploads)
router.get("/uploads/:uploadId/patients", getPatientsByUpload)
router.put("/uploads/:id/approve", approveUpload)
router.put("/uploads/:id/reject", rejectUpload)

// ─── Patients ────────────────────────────────────────────────────────────────
router.get("/patients", getAllPatients)
router.put("/patients/:patientId/assign", assignCenter)
router.post("/patients/:patientId/report", uploadReport.single("report"), uploadReportHandler)
router.delete("/patients/:patientId/report", deleteReport)

// ─── Reschedule ──────────────────────────────────────────────────────────────
router.put("/patients/:patientId/reschedule/approve", approveReschedule)
router.put("/patients/:patientId/reschedule/reject", rejectReschedule)

// ─── Date Change Requests ─────────────────────────────────────────────────────
// NOTE: /patients/date-change-requests must come BEFORE /patients/:patientId
router.get("/patients/date-change-requests", getDateChangeRequests)
router.post("/patients/:patientId/request-date", requestDateChange)
router.put("/patients/:patientId/review-date", reviewDateChange)

module.exports = router