const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Patient = require("../models/Patient")
const mongoose = require("mongoose")

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, employeeId, companyId, phone, address, pincode } = req.body

    if (!name || !email || !password || !employeeId || !companyId) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { employeeId }]
    })

    if (existingUser) {
      return res.status(400).json({ message: "Employee already exists with same email or employee ID" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name, email, password: hashedPassword, employeeId,
      companyId, role: "employee",
      phone: phone || "", address: address || "", pincode: pincode || ""
    })

    await user.save()
    res.status(201).json({ message: "Employee created successfully", user })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.employeeLogin = async (req, res) => {
  try {
    const { email, password, companyId } = req.body

    if (!email || !password || !companyId) {
      return res.status(400).json({ message: "Company, Email/Employee ID and password are required" })
    }

    const user = await User.findOne({
      role: "employee",
      companyId,
      $or: [{ email }, { employeeId: email }]
    })

    if (!user) return res.status(404).json({ message: "Employee not found for selected company" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: "Invalid password" })

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        companyId: user.companyId,
        email: user.email,
        name: user.name,
        employeeId: user.employeeId,
        isTemporaryPassword: user.isTemporaryPassword || false
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({ token, user, isTemporaryPassword: user.isTemporaryPassword || false })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getMyDashboard = async (req, res) => {
  try {
    // ── FIX: always fetch fresh user from DB to get latest patientId
    // req.user comes from authMiddleware which already does User.findById
    // so req.user is already the fresh DB record — use it directly
    const user = req.user

    if (!user) return res.status(401).json({ message: "Unauthorized" })

    // ── FIX: safe ObjectId conversion with fallback
    let patientQuery
    try {
      if (user.patientId) {
        patientQuery = {
          _id: new mongoose.Types.ObjectId(user.patientId.toString()),
          companyId: new mongoose.Types.ObjectId(user.companyId.toString())
        }
      } else {
        patientQuery = {
          companyId: new mongoose.Types.ObjectId(user.companyId.toString()),
          email: user.email
        }
      }
    } catch (idErr) {
      // Fallback if ObjectId conversion fails
      patientQuery = { email: user.email }
    }

    const patients = await Patient.find(patientQuery)
      .populate("assignedCenterId", "name address pincode phone")
      .sort({ appointmentDate: 1, createdAt: -1 })

    // Only show today or future appointments
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const appointments = patients
      .filter(p => p.appointmentDate && new Date(p.appointmentDate) >= now)
      .map(p => ({
        id: p._id,
        employeeName: p.name || user.name,
        age: p.age || "-",
        gender: p.gender || "-",
        centerName: p.assignedCenterId?.name || "Not Assigned Yet",
        centerAddress: p.assignedCenterId
          ? `${p.assignedCenterId.address || ""} - ${p.assignedCenterId.pincode || ""}`
          : "Center not assigned yet",
        appointmentDate: p.appointmentDate,
        appointmentTime: "10:00",   // ── FIX: no AM/PM here — formatTime in frontend handles it
        status: p.status || "requested",
        rescheduleStatus: p.rescheduleStatus || "none",
        rescheduleRequestDate: p.rescheduleRequestDate || null
      }))

    const reports = patients.flatMap((p) => {
      const multiReports = (p.reportUrls || []).map((report, index) => ({
        id: `${p._id}_${index}`,
        fileName: report.originalName || `Report_${p.name || "Employee"}_${index + 1}`,
        date: report.uploadedAt || p.updatedAt || p.createdAt,
        fileUrl: report.url.startsWith("http")
          ? report.url
          : `http://localhost:5000${report.url}`
      }))

      const singleReport = p.reportUrl
        ? [{
            id: `${p._id}_single`,
            fileName: `Report_${p.name || "Employee"}.pdf`,
            date: p.updatedAt || p.createdAt,
            fileUrl: p.reportUrl.startsWith("http")
              ? p.reportUrl
              : `http://localhost:5000${p.reportUrl}`
          }]
        : []

      return [...multiReports, ...singleReport]
    })

    res.json({
      employee: {
        name: user.name,
        email: user.email,
        employeeId: user.employeeId || "",
        phone: user.phone || "",
        address: user.address || "",
        pincode: user.pincode || ""
      },
      appointments,
      reports,
      isTemporaryPassword: user.isTemporaryPassword || false
    })

  } catch (error) {
    console.error("getMyDashboard error:", error.message)
    res.status(500).json({ message: error.message })
  }
}

exports.bookAppointment = async (req, res) => {
  try {
    const user = req.user
    const { appointmentDate } = req.body

    if (!user) return res.status(401).json({ message: "Unauthorized" })
    if (!appointmentDate) return res.status(400).json({ message: "Appointment date is required" })

    const existingRequest = await Patient.findOne({
      companyId: user.companyId,
      email: user.email,
      status: { $in: ["requested", "confirmed"] }
    })

    if (existingRequest) {
      return res.status(400).json({ message: "You already have a pending or confirmed appointment" })
    }

    const patient = new Patient({
      companyId: user.companyId,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      pincode: user.pincode || "",
      appointmentDate,
      status: "requested"
    })

    await patient.save()

    res.status(201).json({
      message: "Appointment request submitted successfully",
      patient,
      isTemporaryPassword: user.isTemporaryPassword || false
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.requestReschedule = async (req, res) => {
  try {
    const user = req.user
    const { newDate } = req.body

    if (!newDate) return res.status(400).json({ message: "New date is required" })

    let patientQuery
    try {
      if (user.patientId) {
        patientQuery = {
          _id: new mongoose.Types.ObjectId(user.patientId.toString()),
          companyId: new mongoose.Types.ObjectId(user.companyId.toString())
        }
      } else {
        patientQuery = {
          companyId: new mongoose.Types.ObjectId(user.companyId.toString()),
          email: user.email
        }
      }
    } catch (idErr) {
      patientQuery = { email: user.email }
    }

    const patient = await Patient.findOne(patientQuery)

    if (!patient) return res.status(404).json({ message: "Patient record not found" })
    if (!patient.appointmentDate) return res.status(400).json({ message: "No appointment date set" })

    const hoursRemaining = (new Date(patient.appointmentDate) - new Date()) / (1000 * 60 * 60)

    if (hoursRemaining <= 48) {
      return res.status(400).json({ message: "Reschedule not allowed — less than 48 hours remaining before appointment" })
    }

    if (patient.rescheduleStatus === "requested") {
      return res.status(400).json({ message: "A reschedule request is already pending admin approval" })
    }

    patient.rescheduleRequestDate = new Date(newDate)
    patient.rescheduleStatus = "requested"
    await patient.save()

    res.json({ message: "Reschedule request submitted successfully", rescheduleRequestDate: patient.rescheduleRequestDate })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}