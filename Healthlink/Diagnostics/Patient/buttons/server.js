const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// ✅ Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Allow frontend requests (CORS)
app.use(cors());

// ✅ Use JSON parser if needed
app.use(express.json());

// ✅ Serve uploaded files statically if you want to access them later
app.use('/uploads', express.static(uploadDir));

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // use created folder
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ Upload endpoint
app.post('/upload-prescription', upload.single('prescription'), (req, res) => {
  console.log('Uploaded:', req.file);

  // Example: return URL to access the uploaded file
  res.json({
    message: '✅ Prescription uploaded successfully!',
    fileUrl: `/uploads/${req.file.filename}`
  });
});

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
