const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const debugMode = true;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'flexify',
});

function validatePostRequest(fields, required, strict=false){
  // fields => keys sent by the POST request
  // required => keys required to be in the POST
  // strict => return false if there are any other fields

  if (strict && fields.length != required.length) return false;
  for (let search in required){
    if (!(search in fields)) return false;
  }
  return true
}

function throwDBError(res, err){
  let msg = 'Internal Server Error';
  if (debugMode) msg += ': ' + err;
  res.status(500).send(msg);
}

function dbPostUserLogin(req, res){
  data = req.body;
  keys = Object.keys(data)
  if (!validatePostRequest(keys, ["email", "password"])){
    throwDBError(res, "Missing POST field(s)");
  }
  connection.query('SELECT * FROM user WHERE email = ? AND password = ?;', [data.email, data.password], (err, result) => {
    if (err) {
      throwDBError(res, err);
    } else {
      if (result.length > 0){
        res.json({ success: true });
      }
      else{
        res.json({ success: false })
      }
    }
  });
}

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Define API endpoints
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      res.status(500).send('Internal Server Error ' + err);
    } else {
      res.json(results);
    }
  });
});

app.post('/api/data', (req, res) => {
  
});

app.post('/api/login', (req, res) => dbPostUserLogin(req, res));


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
