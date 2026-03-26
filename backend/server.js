require("dotenv").config()
const path = require("path")
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

const adminRoutes = require("./routes/adminRoutes")
const hrRoutes = require("./routes/hrRoutes")
const employeeRoutes = require("./routes/employeeRoutes")

const app = express()

connectDB()

// ✅ CORS FIX
const allowedOrigins = [
  "https://admin-healthlink.netlify.app",
  "https://healthlink-diagnostics.netlify.app",
  "http://localhost:5500",
  "http://localhost:5501",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5501",
  "null"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json())

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/api/admin", adminRoutes)
app.use("/api/hr", hrRoutes)
app.use("/api/employee", employeeRoutes)
app.use(
  "/diagnostics",
  express.static(path.join(__dirname, "../Diagnostics"))
)

app.get("/", (req, res) => {
  res.send("HealthLink API running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})