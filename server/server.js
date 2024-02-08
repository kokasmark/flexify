const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require("bcrypt");
var moment = require('moment');

// use DEBUG_MODE to send back error messages to client
// LOGGING_LEVEL 0 = errors, 1 = connect to db, new connections, db errors; 2=function calls, 3=sql commands, query responses, -1 = temporary
const RESPONSE_DEBUG_MODE = true;
const LOGGING_LEVEL = 3;


// setup server and database connection
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const root = require('path').join(__dirname, 'build')
app.use(express.static(root));
app.get("*", (req, res) => {res.sendFile('index.html', { root });})
app.listen(3001, () => {log(`Server listening on port ${3001}`, 1);});
const connection = createConnection()


// setup api paths
app.post('/api/user', (req, res) => dbPostUserDetails(req, res));
app.post('/api/login', (req, res) => dbPostUserLogin(req, res));
app.post('/api/signup', (req, res) => dbPostUserRegister(req, res));

app.post('/api/home/muscles', (req, res) => dbPostUserMuscles(req, res));

app.post('/api/diet', (req, res) => dbPostUserDiet(req, res));
app.post('/api/diet/date', (req, res) => dbPostUserDietOnDate(req, res));
app.post('/api/diet/get_dates', (req, res) => dbPostUserDietDates(req, res));
app.post('/api/diet/add', (req, res) => dbPostUserDietAdd(req, res));

app.post('/api/workouts/date', (req, res) => dbPostUserDates(req, res));
app.post('/api/workouts/data', (req, res) => dbPostUserWorkouts(req, res));
app.post('/api/workouts/save', (req, res) => dbPostSaveWorkout(req, res));
app.post('/api/exercise/muscles', (req, res) => dbPostGetExerciseMuscles(req, res));

app.post('/api/templates/workouts', (req, res) => dbPostSavedWorkoutTemplates(req, res));
app.post('/api/templates/exercises', (req, res) => dbPostExerciseTemplates(req, res));
app.post('/api/templates/save_workout', (req, res) => dbPostSaveWorkoutTemplate(req, res));
app.post('/api/templates/save_exercise', (req, res) => dbPostSaveExerciseTemplate(req, res));

app.post('/api/reset/validate', (req, res) => resetPasswordValidate(req, res));
app.post('/api/reset/generate', (req, res) => resetPasswordGenerate(req, res));
app.post('/api/reset/', (req, res) => resetPassword(req, res));



// validating functions
function validateOne(to_check, test){
    switch (test) {
        case 'email':
            return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(to_check)
        case 'type':
            return to_check in ['rep', 'duration']
        case 'int':
            return Number.isInteger(to_check)
        case 'array':
            return Array.isArray(to_check)
        default:
            log(`Validation not yet implemented: ${test}`, 2)
            return true
    }
}

function validateMany(dict){
    for (const key of Object.keys(dict)) {
        for (const value of dict[key]) {
            if (!validateMany(value, key)) return false
        }
    }
    return true
}


// basic database functions
function createConnection(){
    let connection = mysql.createConnection({
        host: 'bgs.jedlik.eu',
        user: 'flexify',
        password: 'FlFy2023',
        database: 'flexify',
      });
    connection.connect((err) => {
    if (err) log('Error connecting to MySQL:' + err, 1)
    else     log('Connected to MySQL', 1);
    });

    return connection
}

function validatePostRequest(data, required){
    for (let search of required){
        if (!(data.hasOwnProperty(search))) return false
        if (data[search] === '') return false
      }

    return true    
}

function throwErrorOnMissingPostFields(data, required, res, user_id=false){
    if (user_id && validatePostRequest(data, ["token"], res)) return false;
    if (validatePostRequest(data, required, res)) return false;

    throwDBError( `Missing POST field(s). Required: ${required}`, res);
    return true;  
}

async function dbQuery(sql, vars){
    log('sql: ' + sql, 3)
    log('vars: ' + vars, 3)
    let q_result = (await connection.promise().query(sql, vars))[0]
    log('result: ' + q_result, 3)
    return q_result
}

async function validateAndQuery(req, res, sql, vars, nocheck_vars=undefined, single=false, user_id=false){
    let data = req.body
    if (throwErrorOnMissingPostFields(data, vars, res, user_id)) return false
    
    vars = vars.map((x) => data[x])
    if (nocheck_vars) nocheck_vars.map((x) => vars.push(x))

    if (user_id){
        await dbQuery('CALL getUserId(?, @user_id);', [data.token])
        let position = sql.lastIndexOf('?')
        sql = [sql.slice(0, position), '@user_id', sql.slice(position + 1)].join('')
    }
    
    try{
        if (single) return (await dbQuery(sql, vars))[0]
        return await dbQuery(sql, vars);
    }
    catch (error){
        log(error, 1)
        throwDBError(error, res)
        return false
    }
}


async function getUserId(req, res){
    let result = await validateAndQuery(
        req, res, 'SELECT user_id FROM login WHERE token=?', ["token"], []
    )
    if (result.length) return result[0]["user_id"]
    throwDBError("Invalid token", res)
    log("Invalid token", 2)
    return false
}


// response functions
const ERROR = false;
const SUCCESS = true;

function responseJson(res, success, data={}){
    data["success"] = success
    try{
        res.json(data)
    }
    catch (e){
        log("Error trying to respond", 0)
        log(e, 0)
    }
}

function responseTemplate(res, result, data){
    if (result === false || result === undefined) {
        responseJson(res, ERROR)
        return
    }
    let json = {}
    data.map((x) => json[x] = result[x])
    responseJson(res, SUCCESS, json)
}

function responseFail(res, result){
    if (result !== false) responseJson(res, ERROR, {})
}

function responseSuccess(res){
    responseJson(res, SUCCESS, {})
}

function throwDBError(error, res){
    let msg = 'Internal Server Error';
    if (RESPONSE_DEBUG_MODE) msg += ': ' + error;
    responseJson(res, ERROR, {message: msg});  
}


// hashing functions
function generatePasswordHash(password){
    return bcrypt.hash(password, 10).catch(err => log(err, 1))
}

async function compareHash(password, hash){
    return await (bcrypt.compare(password, hash).catch(err => log(err, 1)))
}

function generateUserToken(){
    return require('crypto').randomBytes(32).toString('hex');
}

function generateResetToken(){
    return require('crypto').randomBytes(16).toString('hex');
}

async function updateUserToken(req, res, uid){
    let token = generateUserToken();
    await validateAndQuery(req, res,
        'DELETE FROM login WHERE location=? AND user_id=?',
        ["location"], [uid]
    )
    await validateAndQuery(req, res,
        'INSERT INTO login (location, user_id, token) VALUES (?, ?, ?)',
        ["location"], [uid, token]
    )
    return token
    
}
  

// logging functions
let log_colors = ["\x1b[31m", "\x1b[90m", "\x1b[36m", "\x1b[33m", "\x1b[32m", "\x1b[47m\x1b[30m"]
function log(message, level=-1){
    if (LOGGING_LEVEL >= level){
        process.stdout.write(log_colors.at(level) + "[" + moment().format('YYYY-MM-DD hh:mm:ss') + "]:\x1b[0m ")
        console.log(message)
    } 
}


// db business logic
async function dbPostUserDetails(req, res){
    log('/api/user', 2)
    let sql = 'SELECT username, email FROM user WHERE id=?'

    let result = await validateAndQuery(req, res, sql, [], [], single=true, user_id=true)
    responseTemplate(res, result, ["username", "email"])
}

async function dbPostUserLogin(req, res){
    log('/api/login', 2)
    let sql = 'SELECT id, password FROM user WHERE username = ?'
    let result = await validateAndQuery(req, res, sql, ["username"], [], single=true)
    if (!result){
        throwDBError('Invalid username or password', res)
        return
    }

    let uid = result.id
    let password_hash = result.password

    if (await compareHash(req.body.password, password_hash)){
        let token = await updateUserToken(req, res, uid)
        responseJson(res, SUCCESS, {token: token})
    }
    else{
        throwDBError('Invalid username or password', res)
    }

}

async function dbPostUserRegister(req, res){
    log('/api/signup', 2)
    validatePostRequest(req.body, ["password"])
    let password_hash = await generatePasswordHash(req.body.password)
    let sql = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)'
    let result = await validateAndQuery(req, res, sql, ["username", "email"], [password_hash])
    if (result){
        let uid = result.insertId
        let token = await updateUserToken(req, res, uid)
        responseJson(res, SUCCESS, {token: token})
    }
    else responseFail(res, result)
}

async function dbPostUserMuscles(req, res){
    log('/api/home/muscles', 2)
    let sql = 'SELECT exercise_template.muscles FROM exercise INNER JOIN exercise_template ON exercise.exercise_template_id = exercise_template.id WHERE exercise_template.user_id = ?'
    let result = await validateAndQuery(req, res, sql, [], [], single=false, user_id=true)
    if (result){
        const muscles = result.map(entry => entry.muscles);
        responseJson(res, SUCCESS, {muscles: muscles})
    }
    else responseFail(res, result)
}

async function dbPostUserDiet(req, res){
    log('/api/diet', 2)
    let sql = 'SELECT protein, carbs, fat FROM diet WHERE user_id = ? AND date=CURDATE()'
    let result = await validateAndQuery(req, res, sql, [], [], single=true, user_id=true)
    if (result){
        responseTemplate(res, result, ["protein", "carbs", "fat"])
    }
    else responseFail(res, result)
}

async function dbPostUserDietOnDate(req, res){
    log('/api/diet/date', 2)
    let sql = 'SELECT calories, protein, carbs, fat FROM diet WHERE date=? AND user_id=?'
    let result = await validateAndQuery(req, res, sql, ["date"], [], single=true, user_id=true)
    if (result){
        responseTemplate(res, result, ["protein", "carbs", "fat"])
    }
    else responseFail(res, result)
}

async function dbPostUserDietDates(req, res){
    log('/api/diet/get_dates', 2)
    let sql = `SELECT date FROM diet  WHERE user_id = ?`;
    let result = await validateAndQuery(req, res, sql, [], [], single=false, user_id=true)
    if (result){
        const dates = result.map((row) => row.date); // Extract dates from the result
        responseJson(res, SUCCESS, {dates: dates})
    }
    else responseFail(res, result)
}

async function dbPostUserDietAdd(req, res){
    log('/api/diet/add', 2)
    let sql_current = 'SELECT id FROM diet WHERE user_id = ? AND date=CURDATE()'
    let result = await validateAndQuery(req, res, sql_current, [], [], single=true, user_id=true)
    if (result){
        // having entry for today, add values
        let sql_new = `UPDATE diet SET carbs=carbs+?, fat=fat+?, protein=protein+? WHERE id=?`
        validateAndQuery(req, res, sql_new, ["carbs", "fat", "protein"], [result.id], single=true)
    }
    else{
        // no entry for today, create new
        let sql_new = `INSERT INTO diet (carbs, fat, protein, user_id) VALUES (?, ?, ?, ?)`
        validateAndQuery(req, res, sql_new, ["carbs", "fat", "protein"], [], single=true, user_id=true)
    }
    responseSuccess(res)
}

async function dbPostUserDates(req, res){
    log('/api/workouts/date', 2)
    let sql = 'SELECT DATE_FORMAT( date, "%Y-%m-%d") as date FROM workout WHERE DATE_FORMAT( date, "%Y-%m") = ? AND user_id = ?'
    let result = await validateAndQuery(req, res, sql, ["date"], [], single=false, user_id=true)
    if (result){
        let dateArray = result.map((x) => x.date)
        responseJson(res, SUCCESS, {dates: dateArray})
    }
    else responseFail(res, result)
}

async function dbPostUserWorkouts(req, res){
    log('/api/workouts/data', 2)
    let sql = 'SELECT workout.id, workout.duration, workout.date, workout.workout_name, exercise.set_data, exercise_template.name FROM exercise INNER JOIN workout ON exercise.workout_id = workout.id INNER JOIN exercise_template ON exercise.exercise_template_id = exercise_template.id WHERE DATE_FORMAT( workout.date, "%Y-%m-%d") = ? AND workout.user_id = ?'
    let result = await validateAndQuery(req, res, sql, ["date"], [], single=false, user_id=true)
    if (result && result.length > 0){
        let workoutsArray = result.map((x) => x)
        responseJson(res, SUCCESS, {data: workoutsArray})
    }
    else responseFail(res, result)
}

async function dbPostSaveWorkout(req, res){
    log('/api/workouts/save', 2)
    if (throwErrorOnMissingPostFields(req.body, ["exercises"])){
        responseFail(res)
         return
    }
    let sql = 'INSERT INTO workout (date, workout_name, duration, user_id) VALUES (?, ?, ?, ?)'
    let result = await validateAndQuery(req, res, sql, ["date", "workout_name", "duration"], [], single=false, user_id=true)

    if (!result){
        responseFail(res, result)
        return
    }
    let workout_id = result.insertId
    for (let exercise of req.body.exercises){
        sql = "INSERT INTO exercise (exercise_template_id, workout_id, set_data) VALUES (?, ?, ?)"
        result = await validateAndQuery(req, res, sql, [], [exercise.exercise_template_id, workout_id, JSON.stringify(exercise.set_data)])
    };
    responseSuccess(res)
}

async function dbPostSavedWorkoutTemplates(req, res){
    log('/api/templates/workouts', 2)
    let sql = 'SELECT workout_template.id, workout_template.name, workout_template.comment FROM workout_template WHERE workout_template.user_id = ?'
    let result = await validateAndQuery(req, res, sql, [], [], single=false, user_id=true)

    let templates = []
    for (const template of result) {
        sql = 'SELECT exercise_template_id, set_data, comment FROM workout_template_exercises WHERE workout_template_id=?'
        let result_exercise =  await validateAndQuery(req, res, sql, [], [template.id])
        templates.push({name:template.name, comment:template.comment, data:result_exercise})
    }
    responseJson(res, SUCCESS, {templates: templates})
}

async function dbPostExerciseTemplates(req, res){
    log('/api/templates/exercises', 2)
    let sql = 'SELECT id, name, `type`, muscles,gifUrl FROM exercise_template'
    let result = await validateAndQuery(req, res, sql, [], [])
    let exerciesArray = result.map((x) => x)
    responseJson(res, SUCCESS, {data: exerciesArray})
}

async function dbPostSaveWorkoutTemplate(req, res){
    log('/api/templates/save_workout', 2)
    // TODO: validity check on data, so insert can't fail on only some of the data
    let sql = 'INSERT INTO workout_template (name, comment, user_id) VALUES (?, ?, ?)'
    let result = await validateAndQuery(req, res, sql, ["name", "comment"], [], single=false, user_id=true)
    if (result === false) return
    
    const workoutTemplateId = result.insertId;
    for (let exercise of req.body.data){
        let sql = 'INSERT INTO workout_template_exercises (workout_template_id, exercise_template_id, set_data, comment) VALUES (?, ?, ?, ?)'
        if ((await validateAndQuery(req, res, sql, [], [workoutTemplateId, exercise.id, JSON.stringify(exercise.set_data), exercise.comment])) === false) return
    }
    responseSuccess(res)
}

async function dbPostSaveExerciseTemplate(req, res){
    log('/api/templates/save_exercise', 2)
    // if (!validateOne(req.body.type, 'type')) throwDBError('Invalid data for field [type]')
    let sql = 'INSERT INTO exercise_template (name, \`type\`, muscles, user_id) VALUES (?, ?, ?, ?)'
    let result = await validateAndQuery(req, res, sql, ["name", "type"], [ JSON.stringify(req.body.muscles)], single=false, user_id=true)

    if (result) responseJson(res, SUCCESS, {id: result.insertId})
    else responseFail(res, result)
}

async function dbPostGetExerciseMuscles(req, res){
    log('/api/exercise/muscles', 2)
    let sql = 'SELECT muscles FROM exercise_template WHERE exercise_template.id = ?'
    let result = await validateAndQuery(req, res, sql, ["id"], [], single=true, user_id=false)

    if (result) responseJson(res, SUCCESS, {muscles: result.muscles})
    else responseFail(res, result)
}

async function resetPasswordValidate(req, res){
    log('/api/reset/validate', 2)


    sql = 'SELECT user_id FROM login_reset WHERE token = ?;'
    let result = await validateAndQuery(req, res, sql, ['token'], [])

    if (result.length) responseSuccess(res)
    else responseFail(res, result)
}

async function resetPasswordGenerate(req, res){
    log('/api/reset/generate', 2)

    let sql = 'DELETE FROM login_reset WHERE created < (CURRENT_TIMESTAMP()  - INTERVAL 10 MINUTE);'
    await validateAndQuery(req, res, sql, [], [])
    
    sql = "SELECT id, username,email FROM user WHERE username=? OR email=?"
    let result = await validateAndQuery(req, res, sql, ["user", "user"], [])
    if (!result.length){
        responseFail(res)
        return
    }

    let id = result[0].id
    let token = generateResetToken()
    
    var request = require('request');
    var options = {
    'method': 'POST',
    'url': 'https://mail-flexify.koyeb.app/api/mail',
    'headers': {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "username": result[0].username,
        "email": result[0].email,
        "token": token
    })

    };
    request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    });
  
    sql = "INSERT INTO login_reset (user_id, token) VALUES (?, ?)"
    result = await validateAndQuery(req, res, sql, [], [id, token])
    
    responseJson(res, SUCCESS, {token: token})
}

async function resetPassword(req, res){
    log('/api/reset/', 2)
    validatePostRequest(req.body, ["password"])
    sql = 'SELECT user_id FROM login_reset WHERE token = ?;'
    let result = await validateAndQuery(req, res, sql, ['token'], [])
    if (!result.length){
        responseFail(res, result)
        return
    }

    let id = result[0].user_id
    let hash = await generatePasswordHash(req.body.password)
    sql = 'UPDATE user SET password=? WHERE id=?'
    await validateAndQuery(req, res, sql, [], [hash, id])
    sql = 'DELETE FROM login_reset WHERE token = ?;'
    await validateAndQuery(req, res, sql, ['token'], [])
    responseSuccess(res)
}