const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db');
const { authenticateToken } = require('./auth');

const today = () => new Date().toISOString().slice(0, 10);

// GET /api/user/progress
router.get('/progress', authenticateToken, (req, res) => {
  const userId = req.user ? req.user.email : (req.query.userId || 'guest');
  const db = readDb();

  const userAttempts = (db.attempts || []).filter(a => a.userId === userId);
  const userBookmarks = (db.bookmarks || []).filter(b => b.userId === userId).map(b => b.questionId);
  const userMocks = (db.mocks || []).filter(m => m.userId === userId);
  const userReports = (db.reports || []).filter(r => r.userId === userId);

  // Calculate streak
  const days = new Set([
    ...userAttempts.map(a => a.day),
    ...userMocks.map(m => m.day)
  ]);

  let streak = 0;
  let d = new Date();
  while (days.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  res.json({
    userId,
    attempts: userAttempts,
    bookmarks: userBookmarks,
    mocks: userMocks,
    reports: userReports,
    streak
  });
});

// POST /api/user/attempt
router.post('/attempt', authenticateToken, (req, res) => {
  const userId = req.user ? req.user.email : (req.body.userId || 'guest');
  const { id, topic, cat, ok, sec } = req.body;

  if (id == null || ok == null) {
    return res.status(400).json({ error: 'Question id and outcome (ok) are required.' });
  }

  const db = readDb();
  const newAttempt = {
    userId,
    id: parseInt(id),
    topic: topic || 'General',
    cat: cat || 'Quantitative Aptitude',
    ok: ok ? 1 : 0,
    sec: parseInt(sec) || 0,
    day: today(),
    timestamp: new Date().toISOString()
  };

  db.attempts.push(newAttempt);
  writeDb(db);

  res.json({ message: 'Attempt recorded', attempt: newAttempt });
});

// POST /api/user/bookmark
router.post('/bookmark', authenticateToken, (req, res) => {
  const userId = req.user ? req.user.email : (req.body.userId || 'guest');
  const { questionId } = req.body;

  if (!questionId) {
    return res.status(400).json({ error: 'questionId is required.' });
  }

  const qId = parseInt(questionId);
  const db = readDb();
  
  const index = db.bookmarks.findIndex(b => b.userId === userId && b.questionId === qId);
  let isBookmarked = false;

  if (index >= 0) {
    db.bookmarks.splice(index, 1);
    isBookmarked = false;
  } else {
    db.bookmarks.push({ userId, questionId: qId, createdAt: new Date().toISOString() });
    isBookmarked = true;
  }

  writeDb(db);
  res.json({ message: isBookmarked ? 'Bookmarked' : 'Unbookmarked', isBookmarked, questionId: qId });
});

// GET /api/user/bookmarks
router.get('/bookmarks', authenticateToken, (req, res) => {
  const userId = req.user ? req.user.email : (req.query.userId || 'guest');
  const db = readDb();
  const bookmarkedIds = db.bookmarks.filter(b => b.userId === userId).map(b => b.questionId);
  const questions = db.questions.filter(q => bookmarkedIds.includes(q.id));
  res.json({ bookmarks: questions });
});

// POST /api/user/report
router.post('/report', authenticateToken, (req, res) => {
  const userId = req.user ? req.user.email : (req.body.userId || 'guest');
  const { id, note } = req.body;

  if (!id || !note) {
    return res.status(400).json({ error: 'Question id and report note are required.' });
  }

  const db = readDb();
  const report = {
    userId,
    id: parseInt(id),
    note: String(note).slice(0, 300),
    day: today(),
    timestamp: new Date().toISOString()
  };

  db.reports.push(report);
  writeDb(db);

  res.json({ message: 'Report submitted to administrators', report });
});

module.exports = router;
