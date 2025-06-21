var express = require('express');
var router = express.Router();
const mysql = require('mysql2/promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'DogWalkService'
});

router.get('/api/dogs', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        d.name       AS dog_name,
        d.size       AS size,
        u.username   AS owner_username
      FROM Dogs AS d
      JOIN Users AS u
        ON d.owner_id = u.id
    `);
    
  }
})

router.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM WalkRequests WHERE status = 'open'");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get walk requests' });
  }
});

router.get('/api/walkers/summary', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT u.username, COUNT(wr.request_id) AS completed_walks FROM Users u JOIN WalkApplications wa ON u.user_id = wa.walker_id JOIN WalkRequests wr ON wa.request_id = wr.request_id WHERE u.role = walker AND wa.status = accepted AND wr.status = completed GROUP BY u.username');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get walk requests' });
  }
});

module.exports = router;
