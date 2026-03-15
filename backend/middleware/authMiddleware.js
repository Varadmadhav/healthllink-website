const jwt = require("jsonwebtoken")
const User = require("../models/User")

// ── EXISTING: default export for protecting routes
const authMiddleware = async function (req, res, next) {
  const authHeader = req.headers["authorization"]

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" })
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

// ── ADDED: restrict employees to their own company + patient data only
const enforceCompanyScope = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "hr") return next()
  req.scopedCompanyId = req.user.companyId
  req.scopedPatientId = req.user.patientId
  next()
}

// ── Export both as named exports AND default
module.exports = authMiddleware
module.exports.enforceCompanyScope = enforceCompanyScope