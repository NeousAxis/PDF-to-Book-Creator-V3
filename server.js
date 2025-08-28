const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Configure multer for Vercel (serverless) - use memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// API Routes
app.post('/api/upload-pdf', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({
    message: 'File uploaded successfully',
    file: {
      filename: req.file.originalname,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer.toString('base64') // Convert buffer to base64 for processing
    }
  });
});

app.post('/api/generate-cover', async (req, res) => {
  try {
    // OpenAI integration will be implemented here
    res.json({ message: 'Cover generation endpoint ready' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/lulu-order', async (req, res) => {
  try {
    // Lulu API integration will be implemented here
    res.json({ message: 'Lulu order endpoint ready' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Updated for Vercel compatibility Thu Aug 28 11:14:48 CEST 2025
