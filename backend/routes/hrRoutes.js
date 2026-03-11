const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  hrLogin,
  createHR
} = require("../controllers/hrController");
const auth = require("../middleware/authMiddleware");

const {
  uploadExcel,
  getUploads,
  getPatients,
  getPatientsByUpload
} = require("../controllers/uploadController");

router.post("/login", hrLogin);
router.post("/create", createHR);

router.post("/upload", auth, upload.single("file"), uploadExcel);
router.get("/uploads", auth, getUploads);
router.get("/patients", auth, getPatients);
router.get("/patients/upload/:uploadId", auth, getPatientsByUpload);

module.exports = router;