const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const { enforceCompanyScope } = require("../middleware/authMiddleware")

const {
  createEmployee,
  employeeLogin,
  getMyDashboard,
  bookAppointment,
  requestDateChange,
  requestReschedule,   // kept as alias for backward compat
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/employeeController")

// ── Public routes
router.post("/create", createEmployee)
router.post("/login", employeeLogin)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

// ── Protected routes
router.get("/dashboard", authMiddleware, enforceCompanyScope, getMyDashboard)
router.post("/book-appointment", authMiddleware, enforceCompanyScope, bookAppointment)
router.post("/request-date-change", authMiddleware, enforceCompanyScope, requestDateChange)
router.post("/reschedule", authMiddleware, enforceCompanyScope, requestReschedule) // backward compat
router.post("/change-password", authMiddleware, changePassword)

module.exports = router