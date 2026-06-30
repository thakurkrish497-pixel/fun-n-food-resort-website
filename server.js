const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// File Upload Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'assets', 'images');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Admin Credentials
const ADMIN_EMAIL = 's.kumarcreation@yahoo.com';
const ADMIN_PASS = 'Applemac@0';
const SECRET_TOKEN = 'secret-admin-token-12345'; // simple token for this local setup

// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === `Bearer ${SECRET_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// --- API ROUTES ---

// 1. Get Data
app.get('/api/data', (req, res) => {
  const dataPath = path.join(__dirname, 'data.json');
  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.json(data);
  } else {
    res.status(404).json({ error: 'Data not found' });
  }
});

// 2. Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    res.json({ token: SECRET_TOKEN });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// 3. Update Data (Protected)
app.post('/api/data', authenticate, (req, res) => {
  const dataPath = path.join(__dirname, 'data.json');
  fs.writeFileSync(dataPath, JSON.stringify(req.body, null, 2));
  res.json({ success: true, message: 'Data updated successfully' });
});

// 4. Upload Image (Protected)
app.post('/api/upload', authenticate, upload.single('image'), (req, res) => {
  if (req.file) {
    // Return relative path for frontend to use
    res.json({ url: `assets/images/${req.file.filename}` });
  } else {
    res.status(400).json({ error: 'Upload failed' });
  }
});

// 5. Submit Enquiry (Public)
app.post('/api/enquiry', (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;
  if (!firstName || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const enquiryPath = path.join(__dirname, 'enquiries.json');
  let enquiries = [];
  if (fs.existsSync(enquiryPath)) {
    enquiries = JSON.parse(fs.readFileSync(enquiryPath, 'utf8'));
  }
  
  enquiries.push({
    id: Date.now().toString(),
    date: new Date().toISOString(),
    firstName,
    lastName,
    email,
    phone,
    message
  });
  
  fs.writeFileSync(enquiryPath, JSON.stringify(enquiries, null, 2));
  res.json({ success: true, message: 'Enquiry submitted successfully' });
});

// 6. Get Enquiries (Protected)
app.get('/api/enquiries', authenticate, (req, res) => {
  const enquiryPath = path.join(__dirname, 'enquiries.json');
  if (fs.existsSync(enquiryPath)) {
    const data = JSON.parse(fs.readFileSync(enquiryPath, 'utf8'));
    res.json(data);
  } else {
    res.json([]);
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
