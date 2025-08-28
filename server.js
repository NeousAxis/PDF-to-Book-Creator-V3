<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
=======
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Stripe from 'stripe';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
>>>>>>> aec467ed3928a3c06b776f5151452efa07227606

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
<<<<<<< HEAD
app.use(express.static('dist'));

// Configure multer for Vercel (serverless) - use memory storage
const upload = multer({
  storage: multer.memoryStorage(),
=======

// Configure multer for memory storage (Vercel compatible)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
>>>>>>> aec467ed3928a3c06b776f5151452efa07227606
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// API Routes
app.post('/api/upload-pdf', upload.single('pdf'), (req, res) => {
<<<<<<< HEAD
  console.log('Upload endpoint hit:', req.file ? 'File received' : 'No file');
  
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
=======
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // File is now in memory as req.file.buffer
    const fileInfo = {
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer // Available for processing
    };

    res.json({
      message: 'File uploaded successfully',
      file: {
        name: fileInfo.originalName,
        size: fileInfo.size,
        type: fileInfo.mimetype
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
>>>>>>> aec467ed3928a3c06b776f5151452efa07227606
});

app.post('/api/generate-cover', async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
    const { prompt, bookTitle, authorName, style } = req.body;
    
    // Intégration OpenAI DALL-E ou Midjourney
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `Book cover for "${bookTitle}" by ${authorName}: ${prompt}`,
        n: 1,
        size: "1024x1024",
        style: "vivid"
      })
    });
    
    const data = await response.json();
    res.json({ imageUrl: data.data[0].url });
  } catch (error) {
    res.status(500).json({ error: 'AI generation failed' });
  }
});

app.post('/api/lulu-order', (req, res) => {
  // Lulu API integration here
  res.json({ message: 'Lulu order endpoint' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing - more specific catch-all
app.get('/', (req, res) => {
>>>>>>> aec467ed3928a3c06b776f5151452efa07227606
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

<<<<<<< HEAD
// Updated for Vercel compatibility Thu Aug 28 11:14:48 CEST 2025
=======
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur' } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe utilise les centimes
      currency: currency,
      metadata: {
        bookTitle: req.body.bookTitle,
        quantity: req.body.quantity
      }
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/confirm-payment-and-order', async (req, res) => {
  try {
    const { paymentIntentId, orderDetails } = req.body;
    
    // 1. Vérifier le paiement
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // 2. Envoyer à Lulu.com
      const luluResponse = await submitToLulu(orderDetails);
      res.json({ success: true, luluOrderId: luluResponse.id });
    } else {
      res.status(400).json({ error: 'Payment not confirmed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
>>>>>>> aec467ed3928a3c06b776f5151452efa07227606
