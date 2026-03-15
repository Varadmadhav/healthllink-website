const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const { enforceCompanyScope } = require("../middleware/authMiddleware")

const {
  createEmployee,
  employeeLogin,
  getMyDashboard,
  bookAppointment,
  requestReschedule,
  changePassword,
  forgotPassword,     // ← ADD
  resetPassword,      // ← ADD
} = require("../controllers/employeeController")

// ── Public routes
router.post("/create", createEmployee)
router.post("/login", employeeLogin)
router.post("/forgot-password", forgotPassword)    // ← ADD
router.post("/reset-password", resetPassword)      // ← ADD

// ── Protected routes
router.get("/dashboard", authMiddleware, enforceCompanyScope, getMyDashboard)
router.post("/book-appointment", authMiddleware, enforceCompanyScope, bookAppointment)
router.post("/reschedule", authMiddleware, enforceCompanyScope, requestReschedule)
router.post("/change-password", authMiddleware, changePassword)

module.exports = router