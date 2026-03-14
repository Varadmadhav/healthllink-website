const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")


const {
  createEmployee,
  employeeLogin,
  getMyDashboard,
  bookAppointment
} = require("../controllers/employeeController")


const auth = require("../middleware/authMiddleware")

router.post("/create", createEmployee)
router.post("/login", employeeLogin)
router.get("/dashboard", authMiddleware, getMyDashboard)
router.post("/book-appointment", authMiddleware, bookAppointment)


// employee dashboard data
router.get("/me/dashboard", auth, getMyDashboard)

module.exports = router
