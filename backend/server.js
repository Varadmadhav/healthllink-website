require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require("path")
const connectDB = require("./config/db")
const adminRoutes = require("./routes/adminRoutes")
const hrRoutes = require("./routes/hrRoutes")

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

// Serve uploaded report PDFs so the frontend can download them
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/admin", adminRoutes)
app.use("/api/hr", hrRoutes)

app.get("/", (req, res) => {
  res.send("HealthLink API running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})