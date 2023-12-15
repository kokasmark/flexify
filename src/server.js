const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require("bcrypt");
const { use } = require('bcrypt/promises');

const app = express();
const PORT = 3001;

const print = console.log

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const debugMode = true;

const connection = mysql.createConnection({
  host: 'bgs.jedlik.eu',
  user: 'flexify',
  password: 'FlFy2023',
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

function validatePostRequest(data, required, strict=false){
  let fields = Object.keys(data)
  if (strict && fields.length !== required.length) return false;

  for (let search of required){
    if (!(data.hasOwnProperty(search))) return false
    if (data[search] === '') return false
  }
  return true
}

function throwErrorOnMissingPostFields(data, required, res, strict=false){
  if (validatePostRequest(data, required, res, strict)) return false;

  throwDBError(res, "Missing POST field(s)");
  return true;
}

function throwDBError(res, err){
  let msg = 'Internal Server Error';
  if (debugMode) msg += ': ' + err;
  res.json({success: false, message: msg});
}

function generateUserToken(){
  return require('crypto').randomBytes(32).toString('hex');
}

function getNewUserToken(uid, location, res){
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
  let query = 'SELECT id, password FROM user WHERE username = ?;'

  if (throwErrorOnMissingPostFields(data, required_fields, res)) return

  connection.query(query, [data["username"]], (err, result) => {
    if (err) {
      throwDBError(res, err);
    } else {
      if (result.length > 0){
        let uid = result[0].id
        let password_hash = result[0].password
        compareHash(data.password, password_hash).then(match =>{
          if (match ){
            var token = getNewUserToken(uid, "web", res);
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
  let required_fields = ["username", "email", "password"]
  let data = req.body;
  let query = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)'

  if (throwErrorOnMissingPostFields(data, required_fields, res)) return

  generatePasswordHash(data.password).then(password_hash => {
    connection.query(query, [data.username, data.email, password_hash], (err, result) => {
      if (err) {
        throwDBError(res, err);
      } else {
        let uid = result.insertId
        var token = getNewUserToken(uid, "web", res);
        res.json({ success: true, token: token });
      }
  })
})  
}

function dbPostUserDetails(req, res){
  let required_fields = ["token"]
  let data = req.body;
  let query = 'SELECT user.username, user.email FROM login INNER JOIN user ON login.user_id = user.id WHERE login.token = ?'

  if (throwErrorOnMissingPostFields(data, required_fields, res)) return

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
  let query = 'SELECT exercise_template.muscles FROM exercise INNER JOIN exercise_template ON exercise.exercise_template_id = exercise_template.id WHERE exercise_template.user_id = (SELECT user_id FROM login WHERE token = ?)'

  if (throwErrorOnMissingPostFields(data, required_fields, res)) return

  connection.query(query, [data.token], (err, result) => {
    if (err) {
      throwDBError(res, err);
    } else {
      
      if (result.length > 0){
        console.log(result)
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
  let query = `SELECT diet.calories, diet.protein, diet.carbs, diet.fat FROM diet INNER JOIN user ON diet.user_id = user.id WHERE user_id = (SELECT user_id FROM login WHERE token = ?)`

  if (throwErrorOnMissingPostFields(data, required_fields, res)) return

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
function dbPostUserDates(req, res){
  let required_fields = ["token", "date"]
  let data = req.body;
  let query = `SELECT DATE_FORMAT( workout.date, "%Y-%m-%d") as date FROM login INNER JOIN user ON login.user_id = user.id INNER JOIN workout ON workout.user_id = user.id WHERE login.token = ? AND YEAR(workout.date) = ? AND MONTH(workout.date) = ?`

  if (throwErrorOnMissingPostFields(data, required_fields, res)) return
  
  let year = data.date.split('-')[0];
  let month = data.date.split('-')[1];
  connection.query(query, [data.token, year, month], (err, result) => {
    if (err) {
      throwDBError(res, err);
    } else {
      if (result.length > 0){
        let dateArray = [];
        for(const item of result) dateArray.push(item["date"])
        res.json({ success: true, dates: dateArray});
      }
      else{
        res.json({ success: false })
      }
    }
  });
}
function dbPostUserWorkouts(req, res){
  let required_fields = ["token", "date"]
  let data = req.body;
  let query = `SELECT workout.id, workout.duration, workout.workout_name, exercise.set_data, exercise_template.name FROM exercise INNER JOIN workout ON exercise.workout_id = workout.id INNER JOIN exercise_template  ON exercise.exercise_template_id = exercise_template.id WHERE workout.user_id = (SELECT login.user_id FROM login WHERE login.token = ?) AND DATE_FORMAT( workout.date, "%Y-%m-%d") = ?`

  if (throwErrorOnMissingPostFields(data, required_fields, res)) return

  connection.query(query, [data.token, data.date], (err, result) => {
    if (err) {
      throwDBError(res, err);
    } else {
      if (result.length > 0){
        let workoutsArray = [];
        for(const item of result) workoutsArray.push(item)
        res.json({ success: true, data: workoutsArray });
      }
      else{
        res.json({ success: false })
      }
    }
  });
}
function dbGetExerciseTemplatesByMuscle(req, res) {
  let required_field = "muscle";
  let data = req.body;
  let query = `SELECT exercise_template.name FROM exercise_template WHERE (exercise_template.muscles) LIKE ?`;

  if (throwErrorOnMissingPostFields(data, [required_field], res)) return;

  connection.query(query, "%" + [data.muscle] + "%", (err, result) => {
    if (err) {
      throwDBError(res, err);
    } else {
      if (result.length > 0) {
        let exerciseTemplateNames = result.map((row) => row.name);
        res.json({ success: true, exerciseTemplateNames });
      } else {
        res.json({ success: false, exerciseTemplateNames: [] });
      }
    }
  });
}
function dbPostExerciseTemplates(req, res){
  let required_fields = ["token"]
  let data = req.body;
  let query = `SELECT exercise_template.name, exercise_template.type, exercise_template.muscles FROM exercise_template INNER JOIN user ON exercise_template.user_id = user.id WHERE exercise_template.is_default = 1 OR exercise_template.user_id = (SELECT user_id FROM login WHERE token = ?)`

  if (throwErrorOnMissingPostFields(data, required_fields, res)) return

  connection.query(query, [data.token], (err, result) => {
    if (err) {
      throwDBError(res, err);
    } else {
      if (result.length > 0){
        let exercisesArray = [];
        for(const item of result) exercisesArray.push(item)
        res.json({ success: true, data: exercisesArray });
      }
      else{
        res.json({ success: false })
      }
    }
  });
}

function dbPostSaveWorkoutTemplate(req, res){
  let required_fields = ["token", "name", "comment", "data"]
  let data = req.body;

  if (throwErrorOnMissingPostFields(data, required_fields, res)) return
    // TODO: validity check on data, so insert can't fail on only some of the data

    connection.query('INSERT INTO workout_template (name, user_id, comment) VALUES (?, (SELECT user_id FROM login WHERE token = ?), ?)', [data.name, data.token, data.comment], (err, result) => {
      if (err) {
        throwDBError(res, err);
      } else {
      
      const workoutTemplateId = result.insertId;
      for (let exercise of data.data){
        // TODO: check if user can see the workout that he sent the id for -> possible data leak
        connection.query('INSERT INTO workout_template_exercises (workout_template_id, exercise_template_id, set_data, comment) VALUES (?, ?, ?, ?)', [workoutTemplateId, exercise.id, JSON.stringify(exercise.set_data), exercise.comment], (err, result) => {
          if (err) {
            throwDBError(res, err);
          }
        })
        res.json({ success: true, id: workoutTemplateId });
    }}
    })
  }

function dbPostSaveExerciseTemplate(req, res){
  let required_fields = ["token", "name", "type", "muscles"]
  let data = req.body;
  if (throwErrorOnMissingPostFields(data, required_fields, res)) return
  if (!data.type in ["rep", "duration"]) throwDBError(res, `Invalid exercise type '${data.type}'.`)
  
  let sql = `INSERT INTO exercise_template (name, \`type\`, muscles, user_id) VALUES (?, ?, ?, (SELECT user_id FROM login WHERE token = ?))`
  connection.query(sql, [data.name, data.type, JSON.stringify(data.muscles), data.token], (err, result) =>{
    console.log(result)
    if (err) {
      throwDBError(res, err);
    }
    else if (result.insertId){
      res.json({success: true, id: result.insertId})
    }
    else{
      res.json({success: false})
    }
  })
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
app.post('/api/workouts/date', (req, res) => dbPostUserDates(req, res));
app.post('/api/workouts/data', (req, res) => dbPostUserWorkouts(req, res));
app.post('/api/browse', (req, res) => dbGetExerciseTemplatesByMuscle(req,res));
app.post('/api/templates/exercises', (req, res) => dbPostExerciseTemplates(req, res));
app.post('/api/templates/save_workout', (res, req) => dbPostSaveWorkoutTemplate(res, req));
app.post('/api/templates/save_exercise', (res, req) => dbPostSaveExerciseTemplate(res, req));

const root = require('path').join(__dirname, 'build')
console.log(root);
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
