const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const fs = require ('fs');
const path = require('path');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    mutlipleStatements: true
});

(async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../dogwalks.sql')).toString();
    const conn = await pool.getConnection();
    await conn.query(sql);
    conn.release();
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
})();

router.get('/dogs', async (req, res) => {
  try {
    const [rows] = await pool.query('USE DogWalkService; SELECT * FROM Dogs;');
    res.json(rows[1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await pool.query("USE DogWalkService; SELECT * FROM WalkRequests WHERE status = 'open';");
    res.json(rows[1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/walkers/summary', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      USE DogWalkService;
      SELECT u.username, COUNT(wr.request_id) AS completed_walks
      FROM Users u
      JOIN WalkApplications wa ON u.user_id = wa.walker_id
      JOIN WalkRequests wr ON wa.request_id = wr.request_id
      WHERE u.role = 'walker' AND wa.status = 'accepted' AND wr.status = 'completed'
      GROUP BY u.username;
    `);
    res.json(rows[1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;