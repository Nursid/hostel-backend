// Load environment variables
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');

const app = express();

// Middleware
app.use(express.json());

// Create a MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1); // Exit if DB connection fails
  }
  console.log('✅ MySQL connected successfully');
  connection.release();
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/users', (req, res) => {
  res.send('Hello!, Nursid');
});

app.get('/students', (req, res) => {
  const query = 'SELECT * FROM student LIMIT 5';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching students:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
