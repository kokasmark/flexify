const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require("bcrypt");
const { dataIndexOf } = require('react-widgets/cjs/Accessors');

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

function generatePasswordHash(password){
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds).catch(err => console.log(err))
}

 function compareHash(password, hash){
  let result = (bcrypt.compare(password, hash).catch(err => console.log(err)))
  return result
}

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
  return require('crypto').randomBytes(32).toString('hex');
}

function getNewUserToken(uid, location){
  let token = generateUserToken();

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
  let required_fields = ["username", "password"]
  let data = req.body;
  let fields = Object.keys(data)
  let query = 'SELECT id, password FROM user WHERE username = ?;'

  if (throwErrorOnMissingPostFields(fields, required_fields, res)) return

  connection.query(query, [data.username], (err, result) => {
    if (err) {
      throwDBError(res, err);
    } else {
      
      if (result.length > 0){
        let uid = result[0].id
        let password_hash = result[0].password
        compareHash(data.password, password_hash).then(match =>{
          if (match ){
            var token = getNewUserToken(uid, "web");
            res.json({ success: true, token: token});
          }
          else{
            res.json({ success: false })
          }
        })
        
      }
      else{
        res.json({ success: false })
      }
    }
  });
}

function dbPostUserRegister(req, res){
  // TODO: signupot engedi, ha az összes field üres. kérdés a következő: MIÉRT????
  let required_fields = ["username", "email", "password"]
  let data = req.body;
  let fields = Object.keys(data)
  let query = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)'

  if (throwErrorOnMissingPostFields(fields, required_fields, res)) return

  generatePasswordHash(data.password).then(password_hash => {
    connection.query(query, [data.username, data.email, password_hash], (err, result) => {
      if (err) {
        throwDBError(res, err);
      } else {
        let uid = result.insertId
        var token = getNewUserToken(uid, "web");
        res.json({ success: true, token: token });
      }
  })
  
})
  
}

function dbPostUserDetails(req, res){
  let required_fields = ["token"]
  let data = req.body;
  let fields = Object.keys(data)
  let query = 'SELECT user.username, user.email FROM login INNER JOIN user ON login.user_id = user.id WHERE login.token = ?'

  if (throwErrorOnMissingPostFields(fields, required_fields, res)) return

  connection.query(query, [data.token], (err, result) => {
    if (err) {
      throwDBError(res, err);
    } else {
      
      if (result.length > 0){
        let userInfo = result[0];
        res.json({ success: true, username: userInfo.username, email: userInfo.email});
      }
      else{
        res.json({ success: false })
      }
    }
  });
}
function dbPostUserMuscles(req, res){
  let required_fields = ["token"]
  let data = req.body;
  let fields = Object.keys(data)
  let query = 'SELECT muscles FROM exercise_template WHERE user_id = (SELECT user_id FROM login WHERE token = ?);'

  if (throwErrorOnMissingPostFields(fields, required_fields, res)) return

  connection.query(query, [data.token], (err, result) => {
    if (err) {
      throwDBError(res, err);
    } else {
      
      if (result.length > 0){
        const muscles = result.map(entry => entry.muscles);
        res.json({ success: true, muscles});
      }
      else{
        res.json({ success: false })
      }
    }
  });
}
function dbPostUserDiet(req, res){
  let required_fields = ["token"]
  let data = req.body;
  let fields = Object.keys(data)
  let query = `SELECT diet.calories, diet.protein, diet.carbs, diet.fat FROM diet INNER JOIN user ON diet.user_id = user.id WHERE user_id = (SELECT user_id FROM login WHERE token = ?)`

  if (throwErrorOnMissingPostFields(fields, required_fields, res)) return

  connection.query(query, [data.token], (err, result) => {
    if (err) {
      throwDBError(res, err);
    } else {
      
      if (result.length > 0){
        let userDiet = result[0];
        res.json({ success: true, calories: userDiet.calories, protein: userDiet.protein, carbs: userDiet.carbs, fat: userDiet.fat});
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


app.post('/api/login', (req, res) => dbPostUserLogin(req, res));
app.post('/api/signup', (req, res) => dbPostUserRegister(req, res));
app.post('/api/user', (req, res) => dbPostUserDetails(req, res));
app.post('/api/home/muscles', (req, res) => dbPostUserMuscles(req, res));
app.post('/api/diet', (req, res) => dbPostUserDiet(req, res));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
