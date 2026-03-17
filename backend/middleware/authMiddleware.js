const jwt = require("jsonwebtoken")
const User = require("../models/User")

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
      // FIX: If user not found by _id, try finding by email + companyId.
      // This handles the case where a new User was created for the same employee
      // (e.g. re-confirmed after re-upload) making the old token's _id stale.
      if (decoded.email && decoded.companyId) {
        const userByEmail = await User.findOne({
          email: decoded.email,
          companyId: decoded.companyId,
          role: decoded.role || "employee"
        })
        if (userByEmail) {
          req.user = userByEmail
          return next()
        }
      }
      return res.status(401).json({ message: "User session expired. Please log in again." })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." })
    }
    return res.status(401).json({ message: "Invalid token" })
  }
}

const enforceCompanyScope = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "hr") return next()
  req.scopedCompanyId = req.user.companyId
  req.scopedPatientId = req.user.patientId
  next()
}

module.exports = authMiddleware
module.exports.enforceCompanyScope = enforceCompanyScope