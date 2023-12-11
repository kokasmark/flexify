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

function throwErrorOnMissingPostFields(fields, required, res, strict=false){
  if (validatePostRequest(fields, required, res, strict)) return false;

  throwDBError(res, "Missing POST field(s)");
  return true;
}

function throwDBError(res, err){
  let msg = 'Internal Server Error';
  if (debugMode) msg += ': ' + err;
  res.status(500).send(msg);
}

function generateUserToken(){
  return require('crypto').randomBytes(64).toString('hex');
}

function getNewUserToken(uid, location){
  let token = generateUserToken();
  let success = false;

  connection.query('DELETE FROM login WHERE user_id = ? AND location = ?', [uid, location])
  connection.query('INSERT INTO login (user_id, token, location) VALUES (?, ?, ?)', [uid, token, location], (err, result) => {
    if (err) {
      throwDBError(res, err);
      return
    }
  });
  return token;
}

function dbPostUserLogin(req, res){
  required_fields = ["email", "password"]

  data = req.body;
  fields = Object.keys(data)

  if (throwErrorOnMissingPostFields(fields)) return

  connection.query('SELECT * FROM user WHERE email = ? AND password = ?;', [data.email, data.password], (err, result) => {
    if (err) {
      throwDBError(res, err);
    } else {
      
      if (result.length > 0){
        let uid = result[0].id
        var token = getNewUserToken(uid, "web");
        res.json({ success: true, token: token});
      }
      else{
        res.json({ success: false })
      }
    }
  });
}

function dbPostUserRegister(req, res){
  required_fields = ["username", "email", "password"]

  data = req.body;
  fields = Object.keys(data)

  if (throwErrorOnMissingPostFields(fields)) return

  connection.query('INSERT INTO user (username, email, password) VALUES (?, ?, ?)', [data.username, data.email, data.password], (err, result) => {
    if (err) {
      throwDBError(res, err);
    } else {
      let uid = result.insertId
      var token = getNewUserToken(uid, "web");
      res.json({ success: true, token: token });
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


app.post('/api/login', (req, res) => dbPostUserLogin(req, res));
app.post('/api/signup', (req, res) => dbPostUserRegister(req, res));


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
