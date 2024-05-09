const express = require('express');
const cors = require('cors');
const { pool } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Route to fetch all students
app.get('/student', (req, res) => {
    pool.query('SELECT * FROM students', (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.json(results);
    });
});

// Route to delete a student by ID
app.delete('/student/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('DELETE FROM students WHERE id = $1', [id], (err, result) => {
      if (err) {
          console.error('Error deleting student:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      
      if (result.rowCount === 0) {
          res.status(404).json({ error: 'Student not found' });
          return;
      }

      // Reassign IDs to remain contiguous
      pool.query('ALTER TABLE students AUTO_INCREMENT = 1', (err) => {
          if (err) {
              console.error('Error reassigning IDs:', err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
          }
          
          // Fetch all students after deletion
          pool.query('SELECT * FROM students ORDER BY id', (err, results) => {
              if (err) {
                  console.error('Error fetching students after deletion:', err);
                  res.status(500).json({ error: 'Internal Server Error' });
                  return;
              }
              res.json(results.rows);
          });
      });
  });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/edit',function(req,res){
    res.sendFile(__dirname+'./Edit.vue');
});