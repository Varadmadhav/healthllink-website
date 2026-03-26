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

    const existingUser = await User.findOne({ $or: [{ email }, { employeeId }] })
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
        id: user._id, role: user.role, companyId: user.companyId,
        email: user.email, name: user.name, employeeId: user.employeeId,
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
    const user = req.user
    if (!user) return res.status(401).json({ message: "Unauthorized" })
 
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
 
    const patients = await Patient.find(patientQuery)
      .populate("assignedCenterId", "name address pincode phone")
      .sort({ createdAt: -1 })
 
    const now = new Date()
    now.setHours(0, 0, 0, 0)
 
    const appointments = patients
      // BUG 2 FIX: Show ALL active patients — include confirmed ones with no
      // appointment date yet (date is null until admin assigns it).
      // Only exclude patients whose appointment date has already passed.
      .filter(p => {
        // Always show if no date yet (pending assignment)
        if (!p.appointmentDate) return p.status !== "rejected"
        // Show if appointment date is today or in the future
        return new Date(p.appointmentDate) >= now && p.status !== "rejected"
      })
      .map(p => ({
        id: p._id,
        employeeName: p.name || user.name,
        age: p.age || "-",
        gender: p.gender || "-",
        centerName: p.assignedCenterId?.name || "Not Assigned Yet",
        centerAddress: p.assignedCenterId
          ? `${p.assignedCenterId.address || ""} - ${p.assignedCenterId.pincode || ""}`
          : "Center not assigned yet",
        appointmentDate: p.appointmentDate || null,   // null = "Not assigned yet"
        appointmentTime: p.appointmentTime || "10:00",
        status: p.status || "requested",
        dateChangeRequest: p.dateChangeRequest || null
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
        name: user.name, email: user.email,
        employeeId: user.employeeId || "",
        phone: user.phone || "", address: user.address || "", pincode: user.pincode || ""
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

// ── Unified date change request — replaces old requestReschedule
// Now writes to dateChangeRequest (same as HR flow) so admin sees all requests together
exports.requestDateChange = async (req, res) => {
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
 
    // 48hr rule on current appointment date
    const hoursUntilAppointment = (new Date(patient.appointmentDate) - new Date()) / (1000 * 60 * 60)
    if (hoursUntilAppointment < 48) {
      return res.status(400).json({
        message: "Date change not allowed — appointment is less than 48 hours away"
      })
    }
 
    // Requested date must also be at least 48 hours from now
    const hoursUntilRequested = (new Date(newDate) - new Date()) / (1000 * 60 * 60)
    if (hoursUntilRequested < 48) {
      return res.status(400).json({
        message: "Requested date must be at least 48 hours from now"
      })
    }
 
    // ISSUE 2 FIX: Reset status to "pending" and clear center assignment —
    // same as the HR path in adminController.js requestDateChange.
    // This makes the patient appear in admin's pending table AND date change
    // requests section so admin can act on the request.
    patient.status = "pending"
    patient.assignedCenterId = null
    patient.dateChangeRequest = {
      requestedDate: new Date(newDate),
      requestedBy: "employee",
      requestedByName: user.name,
      status: "pending",
      requestedAt: new Date()
    }
 
    await patient.save()
 
    // Notify HR via email that employee requested a date change
    try {
      const { sendDateChangeNotification } = require("../utils/emailService")
      const User = require("../models/User")
      const hrUser = await User.findOne({ role: "hr", companyId: user.companyId })
      if (hrUser) {
        await sendDateChangeNotification({
          toEmail: hrUser.email,
          recipientName: hrUser.name,
          employeeName: user.name,
          currentDate: patient.appointmentDate,
          requestedDate: new Date(newDate),
          action: "requested",
          requestedBy: "employee"
        })
      }
    } catch (emailErr) {
      console.error("HR notification email failed:", emailErr.message)
    }
 
    res.json({ message: "Date change request submitted successfully", patient })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
 
// Keep old reschedule endpoint as alias for backward compatibility
exports.requestReschedule = exports.requestDateChange

exports.changePassword = async (req, res) => {
  try {
    const user = req.user
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    user.isTemporaryPassword = false
    await user.save()

    res.json({ message: "Password changed successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const crypto = require("crypto")

exports.forgotPassword = async (req, res) => {
  try {
    const { email, companyId } = req.body
    if (!email) return res.status(400).json({ message: "Email is required" })

    const query = { email: email.toLowerCase().trim() }
    if (companyId) query.companyId = companyId

    const user = await User.findOne(query)
    if (!user) return res.json({ message: "If this email exists, a reset link has been sent" })

    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()

    const { sendPasswordResetEmail } = require("../utils/emailService")
    try {
      await sendPasswordResetEmail({ toEmail: user.email, userName: user.name, resetToken, role: user.role })
    } catch (emailErr) {
      console.error("Reset email failed:", emailErr.message)
    }

    res.json({ message: "If this email exists, a reset link has been sent" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link. Please request a new one." })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    user.isTemporaryPassword = false
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    await user.save()

    res.json({ message: "Password reset successfully. You can now log in." })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}