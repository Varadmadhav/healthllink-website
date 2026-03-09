const express = require("express")
const router = express.Router()

const { getPatientsByUpload } = require("../controllers/patientController")

router.get("/upload/:uploadId", getPatientsByUpload)

module.exports = router