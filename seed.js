const fs = require('fs');
const path = require('path');
const { readDb, writeDb } = require('./db');

// Read raw html file to extract the 1000 JSON questions
const htmlPath = path.join(__dirname, 'public', 'index.html');

function seedQuestions() {
  const db = readDb();
  if (db.questions && db.questions.length >= 1000) {
    console.log(`Database already seeded with ${db.questions.length} questions.`);
    return;
  }

  let questions = [];
  if (fs.existsSync(htmlPath)) {
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const match = htmlContent.match(/<script type="application\/json" id="qdata">([\s\S]*?)<\/script>/);
    if (match && match[1]) {
      try {
        questions = JSON.parse(match[1]);
        console.log(`Successfully extracted ${questions.length} questions from HTML script element.`);
      } catch (e) {
        console.error('Failed to parse question JSON from HTML:', e.message);
      }
    }
  }

  if (questions.length > 0) {
    db.questions = questions;
    writeDb(db);
    console.log(`Seeded ${questions.length} questions into AptitudeX database.`);
  } else {
    console.log('No questions found to seed.');
  }
}

if (require.main === module) {
  seedQuestions();
}

module.exports = seedQuestions;
