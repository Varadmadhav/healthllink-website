const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Patient = require("../models/Patient")

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, employeeId, companyId, phone, address, pincode } = req.body

    if (!name || !email || !password || !employeeId || !companyId) {
      return res.status(400).json({ message: "All fields are required" })
    }

   // REPLACE WITH:
const existingUser = await User.findOne({
  $or: [
    { email: patient.email },
    { patientId: patient._id }
  ]
})

// If user exists but was never properly linked to this patient,
// treat as new so they get a fresh temp password
if (existingUser && !existingUser.patientId) {
  existingUser.patientId = patient._id
  existingUser.companyId = patient.companyId?._id || existingUser.companyId
  await existingUser.save()
}

    if (existingUser) {
      return res.status(400).json({ message: "Employee already exists with same email or employee ID" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashedPassword,
      employeeId,
      companyId,
      role: "employee",
      phone: phone || "",
      address: address || "",
      pincode: pincode || ""
    })

    await user.save()

    res.status(201).json({
      message: "Employee created successfully",
      user
    })

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
      $or: [
        { email: email },
        { employeeId: email }
      ]
    })

    if (!user) {
      return res.status(404).json({ message: "Employee not found for selected company" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" })
    }

    // ── CHANGED: added isTemporaryPassword to JWT payload and response
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

    res.json({
      token,
      user,
      isTemporaryPassword: user.isTemporaryPassword || false
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getMyDashboard = async (req, res) => {
  try {
    const user = req.user

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // ── CHANGED: use patientId link if available (Excel-imported employees),
    // fall back to email match for manually created employees
    const patientQuery = user.patientId
      ? { _id: user.patientId, companyId: user.companyId }
      : { companyId: user.companyId, email: user.email }

    const patients = await Patient.find(patientQuery)
      .populate("assignedCenterId", "name address pincode phone")
      .sort({ appointmentDate: 1, createdAt: -1 })

    const appointments = patients
      .filter(p => p.appointmentDate)
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
        appointmentTime: "10:00 AM",
        status: p.status || "requested"
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
    res.status(500).json({ message: error.message })
  }
}

exports.bookAppointment = async (req, res) => {
  try {
    const user = req.user
    const { appointmentDate } = req.body

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!appointmentDate) {
      return res.status(400).json({ message: "Appointment date is required" })
    }

    const existingRequest = await Patient.findOne({
      companyId: user.companyId,
      email: user.email,
      status: { $in: ["requested", "confirmed"] }
    })

    if (existingRequest) {
      return res.status(400).json({
        message: "You already have a pending or confirmed appointment"
      })
    }

    const patient = new Patient({
      companyId: user.companyId,
      name: user.name,
      email: user.email,
      employeeId: user.employeeId || "",
      phone: user.phone || "",
      address: user.address || "",
      pincode: user.pincode || "",
      appointmentDate,
      status: "requested"
    })

    await patient.save()

    // ── CHANGED: added isTemporaryPassword to response
    res.status(201).json({
      message: "Appointment request submitted successfully",
      patient,
      isTemporaryPassword: user.isTemporaryPassword || false
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── NEW: Request reschedule (only allowed if >48hrs before appointment)
exports.requestReschedule = async (req, res) => {
  try {
    const user = req.user
    const { newDate } = req.body

    if (!newDate) {
      return res.status(400).json({ message: "New date is required" })
    }

    // Find the patient record for this employee
    const patientQuery = user.patientId
      ? { _id: user.patientId, companyId: user.companyId }
      : { companyId: user.companyId, email: user.email }

    const patient = await Patient.findOne(patientQuery)

    if (!patient) {
      return res.status(404).json({ message: "Patient record not found" })
    }

    if (!patient.appointmentDate) {
      return res.status(400).json({ message: "No appointment date set" })
    }

    // ── Check 48hr restriction
    const now = new Date()
    const apptDate = new Date(patient.appointmentDate)
    const hoursRemaining = (apptDate - now) / (1000 * 60 * 60)

    if (hoursRemaining <= 48) {
      return res.status(400).json({
        message: "Reschedule not allowed — less than 48 hours remaining before appointment"
      })
    }

    // ── Check if reschedule already pending
    if (patient.rescheduleStatus === "requested") {
      return res.status(400).json({
        message: "A reschedule request is already pending admin approval"
      })
    }

    patient.rescheduleRequestDate = new Date(newDate)
    patient.rescheduleStatus = "requested"
    await patient.save()

    res.json({
      message: "Reschedule request submitted successfully",
      rescheduleRequestDate: patient.rescheduleRequestDate
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}