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
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        wr.id           AS request_id,
        d.name         AS dog_name,
        wr.start_time  AS requested_time,
        wr.duration_mins AS duration_minutes,
        wr.location    AS location,
        u.username     AS owner_username
      FROM WalkRequests AS wr
      JOIN Dogs    AS d ON wr.dog_id   = d.id
      JOIN Users   AS u ON wr.owner_id = u.id
      WHERE wr.status = 'open'
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json
  }
})

router.get('/api/walkers/summary', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT u.username, COUNT(wr.request_id) AS completed_walks FROM Users u JOIN WalkApplications wa ON u.user_id = wa.walker_id JOIN WalkRequests wr ON wa.request_id = wr.request_id WHERE u.role = walker AND wa.status = accepted AND wr.status = completed GROUP BY u.username');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get walk requests' });
  }
});

module.exports = router;
