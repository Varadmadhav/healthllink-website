const express = require("express")
const router = express.Router()

const multer = require("multer")

const { uploadExcel, getUploadHistory } = require("../controllers/uploadController")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/excel")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage })

router.post("/excel", upload.single("file"), uploadExcel)

router.get("/history", getUploadHistory)

module.exports = router