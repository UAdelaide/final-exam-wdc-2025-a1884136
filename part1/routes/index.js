var express = require('express');
var router = express.Router();
const mysql = require('mysql/promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: ''
})

module.exports = router;
