const express = require('express');
const router = express.Router();
const { readDb } = require('../db');

// GET /api/leaderboard
router.get('/', (req, res) => {
  const db = readDb();
  const demoUsers = [
    { n: 'Aarav S.', s: 92, a: 88, t: 14, demo: 1 },
    { n: 'Priya K.', s: 88, a: 85, t: 12, demo: 1 },
    { n: 'Rohan M.', s: 81, a: 79, t: 9, demo: 1 },
    { n: 'Sneha R.', s: 76, a: 74, t: 7, demo: 1 },
    { n: 'Kiran T.', s: 70, a: 68, t: 5, demo: 1 }
  ];

  // Group user mock scores
  const userMap = {};
  (db.mocks || []).forEach(m => {
    if (!userMap[m.userId]) {
      userMap[m.userId] = { userId: m.userId, scores: [], accs: [], tests: 0 };
    }
    userMap[m.userId].scores.push(m.score);
    userMap[m.userId].accs.push(m.acc);
    userMap[m.userId].tests++;
  });

  const realUsers = Object.values(userMap).map(u => {
    const userRecord = db.users.find(usr => usr.email === u.userId);
    const name = userRecord ? userRecord.name : u.userId;
    const maxScore = Math.max(...u.scores);
    const avgAcc = Math.round(u.accs.reduce((a, b) => a + b, 0) / u.accs.length);

    return {
      n: name,
      s: maxScore,
      a: avgAcc,
      t: u.tests,
      demo: 0
    };
  });

  const allLeaderboard = [...demoUsers, ...realUsers].sort((a, b) => b.s - a.s || b.a - a.a);
  res.json({ leaderboard: allLeaderboard });
});

module.exports = router;
