const express = require("express")
const router = express.Router()

const {
  addCompany,
  getCompanies,
  addCenter,
  getCenters,
  getUploads,
  approveUpload,
  rejectUpload
} = require("../controllers/adminController")

router.post("/companies", addCompany)
router.get("/companies", getCompanies)

router.post("/centers", addCenter)
router.get("/centers", getCenters)

router.get("/uploads", getUploads)
router.put("/uploads/:id/approve", approveUpload)
router.put("/uploads/:id/reject", rejectUpload)

module.exports = router