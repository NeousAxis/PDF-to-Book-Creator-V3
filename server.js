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

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// PDF Upload endpoint
app.post('/api/upload-pdf', upload.single('pdf'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File uploaded:', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    res.json({
      success: true,
      filename: req.file.originalname,
      size: req.file.size,
      pages: Math.ceil(req.file.size / 50000) // Rough estimation
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// AI Cover Generation endpoint
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
        imageUrl: 'https://via.placeholder.com/400x600/4f46e5/ffffff?text=AI+Generated+Cover',
        message: 'Mock cover generated (OpenAI API key not configured)'
      });
    }

    // Construct detailed prompt for DALL-E
    const detailedPrompt = `Professional book cover design: ${prompt}. Title: "${bookTitle || 'Untitled'}", Author: "${authorName || 'Unknown Author'}". High quality, print-ready, ${style} style, book cover layout with title and author text placement.`;

    console.log('Calling OpenAI API with prompt:', detailedPrompt);

    // OpenAI DALL-E API call
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: detailedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: style === 'realistic' ? 'natural' : 'vivid'
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', openaiResponse.status, errorData);
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorData}`);
    }

    const openaiData = await openaiResponse.json();
    console.log('OpenAI response received successfully');
    
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

// Lulu Order endpoint
app.post('/api/lulu-order', async (req, res) => {
  try {
    console.log('Lulu order endpoint hit');
    res.json({ message: 'Lulu order endpoint ready' });
  } catch (error) {
    console.error('Lulu order error:', error);
    res.status(500).json({ error: 'Order failed' });
  }
});

// Health check endpoint
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
