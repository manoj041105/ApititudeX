const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db');
const { authenticateToken } = require('./auth');

// Helper to normalize strings for search/match
const norm = s => String(s || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

// GET /api/questions/catalog - Taxonomy of Categories & Topics
router.get('/catalog', (req, res) => {
  const db = readDb();
  const baseCat = db.categories || {};
  const catMap = JSON.parse(JSON.stringify(baseCat));

  (db.questions || []).forEach(q => {
    if (!catMap[q.category]) catMap[q.category] = [];
    if (!catMap[q.category].some(t => norm(t) === norm(q.topic))) {
      catMap[q.category].push(q.topic);
    }
  });

  res.json({ categories: catMap });
});

// GET /api/questions - List, Search, Filter
router.get('/', (req, res) => {
  const db = readDb();
  let questions = db.questions || [];

  const { search, category, topic, difficulty, exam, company, year, question_type, tag, limit, page } = req.query;

  if (search) {
    const s = search.toLowerCase();
    questions = questions.filter(q =>
      (q.question + ' ' + q.topic + ' ' + (q.tags || []).join(' ')).toLowerCase().includes(s)
    );
  }

  if (category) questions = questions.filter(q => norm(q.category) === norm(category));
  if (topic) questions = questions.filter(q => norm(q.topic) === norm(topic));
  if (difficulty) questions = questions.filter(q => q.difficulty === difficulty);
  if (exam) questions = questions.filter(q => q.exam === exam);
  if (company) questions = questions.filter(q => q.company === company);
  if (year) questions = questions.filter(q => String(q.year) === String(year));
  if (question_type) questions = questions.filter(q => q.question_type === question_type);
  if (tag) questions = questions.filter(q => (q.tags || []).includes(tag));

  const total = questions.length;
  const p = parseInt(page) || 1;
  const l = parseInt(limit) || 1000;
  const startIndex = (p - 1) * l;
  const paginated = questions.slice(startIndex, startIndex + l);

  res.json({
    total,
    page: p,
    limit: l,
    questions: paginated
  });
});

// GET /api/questions/export - Export all questions (Admin only)
router.get('/export', authenticateToken, (req, res) => {
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  const db = readDb();
  res.json(db.questions || []);
});

// GET /api/questions/:id - Get single question
router.get('/:id', (req, res) => {
  const db = readDb();
  const id = parseInt(req.params.id);
  const q = (db.questions || []).find(item => item.id === id);
  if (!q) return res.status(404).json({ error: 'Question not found' });
  res.json(q);
});

// POST /api/questions - Create Question (Admin only)
router.post('/', authenticateToken, (req, res) => {
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  const { category, topic, subtopic, difficulty, question, options, answer, explanation, company, exam, year, question_type, time_limit, marks, negative_marks, tags } = req.body;

  if (!category || !topic || !question || !Array.isArray(options) || options.length < 2 || !options.includes(answer)) {
    return res.status(400).json({ error: 'Invalid question payload. Category, topic, question text, at least 2 options, and valid answer matching options are required.' });
  }

  const db = readDb();
  const maxId = Math.max(0, ...(db.questions || []).map(q => +q.id || 0));
  const newQuestion = {
    id: maxId + 1,
    category,
    topic,
    subtopic: subtopic || topic,
    difficulty: difficulty || 'Easy',
    question,
    options,
    answer,
    explanation: explanation || '',
    company: company || 'General',
    exam: exam || 'Placement Practice',
    year: parseInt(year) || new Date().getFullYear(),
    question_type: question_type || 'MCQ',
    time_limit: parseInt(time_limit) || 60,
    marks: parseFloat(marks) || 1,
    negative_marks: parseFloat(negative_marks) || 0,
    tags: Array.isArray(tags) ? tags : []
  };

  db.questions.push(newQuestion);
  writeDb(db);

  res.status(201).json({ message: 'Question created successfully', question: newQuestion });
});

// PUT /api/questions/:id - Update Question (Admin only)
router.put('/:id', authenticateToken, (req, res) => {
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  const id = parseInt(req.params.id);
  const db = readDb();
  const index = (db.questions || []).findIndex(q => q.id === id);
  if (index === -1) return res.status(404).json({ error: 'Question not found' });

  const existing = db.questions[index];
  const updated = { ...existing, ...req.body, id };

  if (!updated.options.includes(updated.answer)) {
    return res.status(400).json({ error: 'Answer must match one of the available options.' });
  }

  db.questions[index] = updated;
  writeDb(db);

  res.json({ message: 'Question updated successfully', question: updated });
});

// DELETE /api/questions/:id - Delete Question (Admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  const id = parseInt(req.params.id);
  const db = readDb();
  const initialLen = db.questions.length;
  db.questions = db.questions.filter(q => q.id !== id);

  if (db.questions.length === initialLen) {
    return res.status(404).json({ error: 'Question not found' });
  }

  writeDb(db);
  res.json({ message: `Question #${id} deleted successfully` });
});

// POST /api/questions/import - Bulk Import (Admin only)
router.post('/import', authenticateToken, (req, res) => {
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  const { questions: items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Expected payload containing array of questions.' });
  }

  const db = readDb();
  let maxId = Math.max(0, ...(db.questions || []).map(q => +q.id || 0));
  let imported = 0;
  let skipped = 0;

  items.forEach(item => {
    if (!item.category || !item.topic || !item.question || !Array.isArray(item.options) || item.options.length < 2 || !item.options.includes(item.answer)) {
      skipped++;
      return;
    }

    maxId++;
    const cleanQ = {
      id: item.id ? parseInt(item.id) : maxId,
      category: item.category,
      topic: item.topic,
      subtopic: item.subtopic || item.topic,
      difficulty: item.difficulty || 'Easy',
      question: item.question,
      options: item.options,
      answer: item.answer,
      explanation: item.explanation || '',
      company: item.company || 'General',
      exam: item.exam || 'Placement Practice',
      year: parseInt(item.year) || new Date().getFullYear(),
      question_type: item.question_type || 'MCQ',
      time_limit: parseInt(item.time_limit) || 60,
      marks: parseFloat(item.marks) || 1,
      negative_marks: parseFloat(item.negative_marks) || 0,
      tags: Array.isArray(item.tags) ? item.tags : []
    };

    // Remove duplicates if same ID exists
    db.questions = db.questions.filter(q => q.id !== cleanQ.id);
    db.questions.push(cleanQ);
    imported++;
  });

  writeDb(db);
  res.json({ message: `Import completed. ${imported} questions added/updated, ${skipped} skipped.` });
});

module.exports = router;
