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
  console.log('Upload endpoint hit:', req.file ? 'File received' : 'No file');
  console.log('Request headers:', req.headers);
  console.log('Request body keys:', Object.keys(req.body));
  
  if (!req.file) {
    console.log('Error: No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  console.log('File details:', {
    filename: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
  
  res.json({
    message: 'File uploaded successfully',
    file: {
      filename: req.file.originalname,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer.toString('base64')
    }
  });
});

app.post('/api/generate-cover', async (req, res) => {
  try {
    console.log('Generate cover endpoint hit');
    console.log('Request body:', req.body);
    
    const { prompt, bookTitle, authorName, style = 'realistic' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not found, returning mock response');
      return res.json({
        success: true,
        imageUrl: '/api/placeholder/400/600',
        message: 'Mock cover generated (OpenAI API key not configured)'
      });
    }

    // OpenAI DALL-E API call
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `Professional book cover design: ${prompt}. Title: "${bookTitle}", Author: "${authorName}". High quality, print-ready, ${style} style.`,
        n: 1,
        size: '1024x1024',
        quality: 'hd'
      })
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    
    res.json({
      success: true,
      imageUrl: openaiData.data[0].url,
      message: 'Cover generated successfully'
    });
    
  } catch (error) {
    console.error('Cover generation error:', error);
    res.status(500).json({ 
      error: 'Cover generation failed',
      details: error.message 
    });
  }
});

app.post('/api/lulu-order', async (req, res) => {
  try {
    console.log('Lulu order endpoint hit');
    res.json({ message: 'Lulu order endpoint ready' });
  } catch (error) {
    console.error('Lulu order error:', error);
    res.status(500).json({ error: 'Order failed' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server (for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
