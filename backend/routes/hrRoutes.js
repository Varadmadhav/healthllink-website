const express = require("express");
const router = express.Router();
const multer = require("multer");

// Use memoryStorage so XLSX can read the buffer directly without saving a temp file
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  hrLogin,
  createHR
} = require("../controllers/hrController");

const {
  uploadExcel,
  getUploads,
  getPatients 
} = require("../controllers/uploadController");

// --- Auth Routes ---
// URL: /api/hr/login
router.post("/login", hrLogin);
// URL: /api/hr/create
router.post("/create", createHR);

// --- Excel & Data Routes ---
// URL: /api/hr/upload
router.post("/upload", upload.single("file"), uploadExcel);

// URL: /api/hr/uploads
router.get("/uploads", getUploads);

// URL: /api/hr/patients
// This fixes the 404 Error in your browser console
router.get("/patients", getPatients); 

module.exports = router;