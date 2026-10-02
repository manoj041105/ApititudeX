const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db');
const { authenticateToken } = require('./auth');

const today = () => new Date().toISOString().slice(0, 10);
const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

// POST /api/mocks/generate
router.post('/generate', (req, res) => {
  const { title, company, category, difficulty, count } = req.body;
  const numQuestions = parseInt(count) || 20;

  const db = readDb();
  let pool = db.questions || [];

  if (company) {
    const companyQs = pool.filter(q => q.company === company);
    if (companyQs.length >= 10) pool = companyQs;
  }

  if (category) {
    pool = pool.filter(q => q.category === category);
  }

  if (difficulty && difficulty !== 'Mixed') {
    pool = pool.filter(q => q.difficulty === difficulty);
  }

  if (pool.length === 0) {
    return res.status(404).json({ error: 'No questions matched the specified mock criteria.' });
  }

  const selected = shuf(pool).slice(0, numQuestions).map(q => ({
    ...q,
    options: shuf(q.options)
  }));

  const totalSecs = selected.reduce((acc, q) => acc + (q.time_limit || 60), 0);

  res.json({
    title: title || (company ? `${company} Company Mock` : 'Mock Test'),
    totalQuestions: selected.length,
    timeLimitSeconds: totalSecs,
    questions: selected
  });
});

// POST /api/mocks/submit
router.post('/submit', authenticateToken, (req, res) => {
  const userId = req.user ? req.user.email : (req.body.userId || 'guest');
  const { title, questions, answers, timeSpentSeconds } = req.body;

  if (!Array.isArray(questions) || !answers) {
    return res.status(400).json({ error: 'questions array and answers object are required.' });
  }

  const db = readDb();
  const sc = db.config || { c: 1, w: 0, u: 0 };
  const topicStats = {};

  let correct = 0;
  let wrong = 0;

  const review = questions.map((q, i) => {
    const userChoice = answers[i] != null ? answers[i] : null;
    const isCorrect = userChoice === q.answer;

    const t = topicStats[q.topic] = topicStats[q.topic] || { n: 0, ok: 0 };
    t.n++;

    if (userChoice != null) {
      if (isCorrect) {
        correct++;
        t.ok++;
      } else {
        wrong++;
      }
    }

    // Record question attempt in user attempts table
    if (userChoice != null) {
      db.attempts.push({
        userId,
        id: q.id,
        topic: q.topic,
        cat: q.category,
        ok: isCorrect ? 1 : 0,
        sec: Math.round((timeSpentSeconds || 60) / questions.length),
        day: today(),
        timestamp: new Date().toISOString()
      });
    }

    return {
      q: q.question,
      topic: q.topic,
      you: userChoice,
      ans: q.answer,
      ex: q.explanation
    };
  });

  const total = questions.length;
  const att = correct + wrong;
  const un = total - att;
  const score = parseFloat((correct * sc.c - wrong * sc.w - un * sc.u).toFixed(2));
  const acc = att ? Math.round((100 * correct) / att) : 0;

  const result = {
    id: (db.mocks || []).length + 1,
    userId,
    title: title || 'Mock Test',
    day: today(),
    total,
    att,
    correct,
    wrong,
    un,
    score,
    acc,
    took: parseInt(timeSpentSeconds) || 0,
    topics: topicStats,
    review,
    timestamp: new Date().toISOString()
  };

  db.mocks.push(result);
  writeDb(db);

  res.json({ message: 'Mock test evaluated and submitted successfully', result });
});

// GET /api/mocks/history
router.get('/history', authenticateToken, (req, res) => {
  const userId = req.user ? req.user.email : (req.query.userId || 'guest');
  const db = readDb();

  const userMocks = (db.mocks || [])
    .filter(m => m.userId === userId)
    .map(m => {
      const { review, ...summary } = m;
      return summary;
    });

  res.json({ history: userMocks });
});

module.exports = router;
