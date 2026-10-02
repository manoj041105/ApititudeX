const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const seedQuestions = require('./seed');
const { router: authRouter } = require('./routes/auth');
const questionsRouter = require('./routes/questions');
const userRouter = require('./routes/user');
const mocksRouter = require('./routes/mocks');
const leaderboardRouter = require('./routes/leaderboard');
const configRouter = require('./routes/config');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/user', userRouter);
app.use('/api/mocks', mocksRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/config', configRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'AptitudeX API' });
});

// Fallback route for Single Page Application
app.get('*', (req, res) => {
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Seed questions & start server
seedQuestions();

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 AptitudeX Express Backend is running on port ${PORT}`);
  console.log(`🌐 Local Web Interface: http://localhost:${PORT}`);
  console.log(`📡 REST API Base URL:  http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});
