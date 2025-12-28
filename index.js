const express = require('express');
const mysql = require('mysql2');

const app = express();

// Middleware
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user:  process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    return;
  }
  console.log('✅ MySQL connected successfully');
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello!');
});

const PORT = process.env.PORT ||  3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
