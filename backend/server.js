require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const adminRoutes = require("./routes/adminRoutes")
const hrRoutes = require("./routes/hrRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
const patientRoutes = require("./routes/patientRoutes")

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/admin", adminRoutes)
app.use("/api/hr", hrRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/patients", patientRoutes)

app.get("/", (req, res) => {
  res.send("HealthLink API running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})