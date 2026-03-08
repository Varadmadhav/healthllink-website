const express = require("express")
const router = express.Router()

const {
  addCompany,
  getCompanies,
  addCenter,
  getCenters
} = require("../controllers/adminController")

router.post("/companies", addCompany)
router.get("/companies", getCompanies)

router.post("/centers", addCenter)
router.get("/centers", getCenters)

module.exports = router