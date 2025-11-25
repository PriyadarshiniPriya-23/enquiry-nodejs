// src/app.js
// Express app: middleware (helmet/morgan optional), CORS, JSON parsing,
// route mounting, health check and a central error handler.

require('express-async-errors'); // capture async errors and forward to handler
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// optional middleware: helmet & morgan (install if you want)
let helmet;
let morgan;
try {
  helmet = require('helmet');
  morgan = require('morgan');
} catch (e) {
  // optional middleware not installed - app still works
  console.warn('Optional middleware not installed: helmet and/or morgan. Install for better security/logging.');
}

// Import your route modules (adjust paths/names if required)
const authRoutes = require('./routes/authRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const studentEnquiryRoutes = require('./routes/studentEnquiryRoutes');
const demoListRoutes = require('./routes/demoListRoutes');
const courseRoutes = require('./routes/courseRoutes');
const batchTimingRoutes = require('./routes/batchTimingRoutes');
const studentPlacementRoutes = require('./routes/studentPlacementRoutes');

const app = express();

// Security headers if available
if (helmet) app.use(helmet());

// Logging
if (morgan) app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS
// Allow client origin from env or default to localhost:3000
const CLIENT_ORIGIN = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route mounts (prefix with /api)
app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/student_enquiries', studentEnquiryRoutes);
app.use('/api/demo_lists', demoListRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/batch_timings', batchTimingRoutes);
app.use('/api/student-placement', studentPlacementRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Serve React build in production (ensure build path is correct)
if (process.env.NODE_ENV === 'production') {
  // By default expect frontend build at ../enquiry-frontend/build relative to src/
  const buildPath = process.env.CLIENT_BUILD_PATH || path.join(__dirname, '..', 'enquiry-frontend', 'build');
  app.use(express.static(buildPath));
  // Send index.html for unmatched routes (client-side routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Central error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  const status = err.status || 500;
  const body = { error: err.message || 'Internal Server Error' };
  if (process.env.NODE_ENV !== 'production') {
    body.stack = err.stack;
  }
  res.status(status).json(body);
});

module.exports = app;
