const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Create HR user (Admin will use this)
exports.createHR = async (req, res) => {
  try {

    const { name, email, password, companyId } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "hr",
      companyId
    })

    await user.save()

    res.status(201).json(user)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// HR Login
exports.hrLogin = async (req, res) => {

  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" })
    }

    const token = jwt.sign(
  { id: user._id, role: user.role, companyId: user.companyId },
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