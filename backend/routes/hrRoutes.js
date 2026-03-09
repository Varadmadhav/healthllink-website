const express = require("express")
const router = express.Router()
const multer = require("multer")
const upload = multer()

const {
  hrLogin,
  createHR
} = require("../controllers/hrController")

const {
  uploadExcel,
  getUploads
} = require("../controllers/uploadController")

router.post("/login", hrLogin)

router.post("/create", createHR)

router.post("/upload", upload.single("file"), uploadExcel)

router.get("/uploads", getUploads)

module.exports = router