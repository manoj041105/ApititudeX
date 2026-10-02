const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial default schema
const defaultData = {
  users: [],
  questions: [],
  attempts: [],
  bookmarks: [],
  reports: [],
  mocks: [],
  categories: {
    'Quantitative Aptitude': [
      'Percentages', 'Profit & Loss', 'Average', 'Ratio & Proportion',
      'Time & Work', 'Time, Speed & Distance', 'Simple Interest',
      'Compound Interest', 'Probability', 'Permutation & Combination',
      'Number System', 'HCF & LCM', 'Algebra', 'Ages', 'Mixtures', 'Data Interpretation'
    ],
    'Logical Reasoning': [
      'Number Series', 'Coding-Decoding', 'Blood Relations', 'Directions',
      'Syllogisms', 'Seating Arrangement', 'Puzzles', 'Analogy',
      'Classification', 'Statement & Conclusion', 'Data Sufficiency', 'Clocks', 'Calendars'
    ],
    'Verbal Ability': [
      'Reading Comprehension', 'Sentence Correction', 'Synonyms', 'Antonyms',
      'Para Jumbles', 'Fill in the Blanks', 'Vocabulary', 'Grammar'
    ]
  },
  config: {
    c: 1, // Correct answer marks
    w: 0, // Incorrect answer deduction
    u: 0  // Unattempted deduction
  }
};

function ensureDbExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

function readDb() {
  ensureDbExists();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return defaultData;
  }
}

function writeDb(data) {
  ensureDbExists();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

module.exports = {
  readDb,
  writeDb
};
