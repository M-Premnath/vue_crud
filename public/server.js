const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Leave it empty if you haven't set a password for MySQL
  database: 'your_database' // Replace 'your_database' with the name of your database
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Define routes here

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});


// Define route to get all students
app.get('/students', (req, res) => {
  const query = 'SELECT * FROM students';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});