const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db');
const { authenticateToken } = require('./auth');

// GET /api/config/scoring
router.get('/scoring', (req, res) => {
  const db = readDb();
  res.json({ config: db.config || { c: 1, w: 0, u: 0 } });
});

// POST /api/config/scoring (Admin only)
router.post('/scoring', authenticateToken, (req, res) => {
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  const { c, w, u } = req.body;
  if (c == null || w == null || u == null) {
    return res.status(400).json({ error: 'c (correct), w (wrong), and u (unattempted) values are required.' });
  }

  const db = readDb();
  db.config = {
    c: parseFloat(c),
    w: Math.abs(parseFloat(w)),
    u: Math.abs(parseFloat(u))
  };

  writeDb(db);
  res.json({ message: 'Scoring settings updated successfully', config: db.config });
});

module.exports = router;
