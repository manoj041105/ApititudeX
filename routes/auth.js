const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb, writeDb } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'aptitudex_secret_jwt_key_2026';

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) req.user = null;
    else req.user = user;
    next();
  });
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, name, password, recoveryPhrase } = req.body;
  if (!email || !name || !password || !recoveryPhrase) {
    return res.status(400).json({ error: 'All fields are required (email, name, password, recoveryPhrase).' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = readDb();
  
  if (db.users.some(u => u.email === normalizedEmail)) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedRecovery = await bcrypt.hash(recoveryPhrase.trim().toLowerCase(), 10);

  const isFirstUser = db.users.length === 0;

  const newUser = {
    id: db.users.length + 1,
    email: normalizedEmail,
    name: name.trim(),
    password: hashedPassword,
    recovery: hashedRecovery,
    admin: isFirstUser,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);

  const token = jwt.sign(
    { email: newUser.email, name: newUser.name, admin: newUser.admin },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    message: 'Account created successfully',
    token,
    user: { email: newUser.email, name: newUser.name, admin: newUser.admin }
  });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = readDb();
  const user = db.users.find(u => u.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { email: user.email, name: user.name, admin: !!user.admin },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    message: 'Logged in successfully',
    token,
    user: { email: user.email, name: user.name, admin: !!user.admin }
  });
});

// POST /api/auth/forgot
router.post('/forgot', async (req, res) => {
  const { email, recoveryPhrase, newPassword } = req.body;
  if (!email || !recoveryPhrase || !newPassword) {
    return res.status(400).json({ error: 'Email, recovery phrase, and new password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = readDb();
  const user = db.users.find(u => u.email === normalizedEmail);

  if (!user) {
    return res.status(404).json({ error: 'Account not found.' });
  }

  const validRecovery = await bcrypt.compare(recoveryPhrase.trim().toLowerCase(), user.recovery);
  if (!validRecovery) {
    return res.status(401).json({ error: 'Incorrect recovery phrase.' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  writeDb(db);

  return res.json({ message: 'Password updated successfully. You can now log in.' });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.json({ user: req.user });
});

module.exports = { router, authenticateToken };
