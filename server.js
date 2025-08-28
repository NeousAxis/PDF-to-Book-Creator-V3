const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Add environment variables logging for debugging
console.log('Environment check:', {
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  openAIKeyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) : 'none',
  hasLuluClientId: !!process.env.LULU_CLIENT_ID,
  hasLuluClientSecret: !!process.env.LULU_CLIENT_SECRET,
  nodeEnv: process.env.NODE_ENV
});

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
    console.log('Environment check:', {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      keyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0
    });
    
    const { prompt, bookTitle, authorName, style = 'realistic' } = req.body;
    
    if (!prompt) {
      console.error('Missing prompt in request');
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found in environment variables');
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        details: 'Please check server configuration'
      });
    }

    // Validate API key format
    if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
      console.error('Invalid OpenAI API key format');
      return res.status(500).json({ 
        error: 'Invalid OpenAI API key format',
        details: 'API key should start with sk-'
      });
    }

    // Construct detailed prompt for DALL-E
    const detailedPrompt = `Professional book cover design: ${prompt}. Title: "${bookTitle || 'Untitled'}", Author: "${authorName || 'Unknown Author'}". High quality, print-ready, ${style} style, book cover layout with title and author text placement.`;

    console.log('Calling OpenAI API with prompt:', detailedPrompt.substring(0, 100) + '...');

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

    console.log('OpenAI API response status:', openaiResponse.status);

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error details:', {
        status: openaiResponse.status,
        statusText: openaiResponse.statusText,
        error: errorData
      });
      
      return res.status(500).json({ 
        error: `OpenAI API error: ${openaiResponse.status}`,
        details: errorData,
        suggestion: openaiResponse.status === 401 ? 'Please check your OpenAI API key' : 'Please try again later'
      });
    }

    const openaiData = await openaiResponse.json();
    console.log('OpenAI response received successfully');
    
    res.json({
      success: true,
      imageUrl: openaiData.data[0].url,
      message: 'Cover generated successfully'
    });
    
  } catch (error) {
    console.error('Cover generation error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: 'Failed to generate cover',
      details: error.message,
      type: error.name
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

// Lulu Cost Calculation endpoint
app.post('/api/lulu-cost', async (req, res) => {
  try {
    console.log('Lulu cost calculation endpoint hit');
    console.log('Request body:', req.body);
    
    const { podPackageId, pageCount, quantity = 1 } = req.body;
    
    if (!podPackageId || !pageCount) {
      return res.status(400).json({ error: 'podPackageId and pageCount are required' });
    }

    // Check if Lulu credentials are available
    if (!process.env.LULU_CLIENT_ID || !process.env.LULU_CLIENT_SECRET) {
      console.error('Lulu credentials not found in environment variables');
      return res.status(500).json({ 
        error: 'Lulu API credentials not configured',
        details: 'Please check server configuration'
      });
    }

    // Mock calculation for now
    const basePrice = pageCount * 0.012 + 3.50;
    const unitPrice = basePrice;
    const subtotal = unitPrice * quantity;
    const taxes = subtotal * 0.08;
    const fulfillmentFee = 1.50;
    const shippingCost = quantity === 1 ? 3.99 : 5.99;
    const total = subtotal + taxes + fulfillmentFee + shippingCost;

    res.json({
      success: true,
      cost: {
        unitPrice,
        discounts: 0,
        taxes,
        fulfillmentFee,
        shippingCost,
        subtotal,
        total,
        quantity
      }
    });
    
  } catch (error) {
    console.error('Lulu cost calculation error:', error);
    res.status(500).json({ 
      error: 'Failed to calculate cost',
      details: error.message
    });
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
