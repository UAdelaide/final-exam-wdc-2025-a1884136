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

(async)