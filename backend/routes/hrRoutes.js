const express = require("express")
const router = express.Router()

const {
  hrLogin,
  createHR
} = require("../controllers/hrController")

router.post("/login", hrLogin)
router.post("/create", createHR)

module.exports = router