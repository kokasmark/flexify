const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'your-mysql-host',
  user: 'your-mysql-username',
  password: 'your-mysql-password',
  database: 'your-mysql-database',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Define API endpoints
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM your_table', (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

app.post('/api/data', (req, res) => {
  const { name, value } = req.body;
  connection.query('INSERT INTO your_table (name, value) VALUES (?, ?)', [name, value], (err, result) => {
    if (err) {
      console.error('Error inserting into MySQL:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ success: true });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
