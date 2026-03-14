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

    const existingUser = await User.findOne({
      $or: [
        { email },
        { employeeId }
      ]
    })

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

    const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
    companyId: user.companyId,
    email: user.email,
    name: user.name,
    employeeId: user.employeeId
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
)


    res.json({
      token,
      user
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

    const patients = await Patient.find({
      companyId: user.companyId,
      email: user.email
    })
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
      reports
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

    res.status(201).json({
      message: "Appointment request submitted successfully",
      patient
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
