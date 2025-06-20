var express = require('express');
const { createPool } = require('mysql');
var router = express.Router();
const mysql = require('mysql/promise');

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
    const [rows] = await pool.query('SELECT * FROM Dogs');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get dogs' });
  }
});

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
    const [rows] = await pool.query
  }
})

module.exports = router;
