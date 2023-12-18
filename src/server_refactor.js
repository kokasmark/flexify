const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require("bcrypt");
var moment = require('moment')


// use DEBUG_MODE to send back error messages to client
// LOGGING_LEVEL 0 = nothing, 1 = connect to db, new connections, db errors; 2=function calls, 3=sql commands, query responses, -1 = temporary
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

app.post('/api/templates/workouts', (req, res) => dbPostSavedWorkoutTemplates(req, res));
app.post('/api/templates/exercises', (req, res) => dbPostExerciseTemplates(req, res));
app.post('/api/templates/save_workout', (req, res) => dbPostSaveWorkoutTemplate(req, res));
app.post('/api/templates/save_exercise', (req, res) => dbPostSaveExerciseTemplate(req, res));





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

function throwDBError(error, res){
    let msg = 'Internal Server Error';
    if (RESPONSE_DEBUG_MODE) msg += ': ' + error;
    res.json({success: false, message: msg});  
}

function validatePostRequest(data, required){
    for (let search of required){
        if (!(data.hasOwnProperty(search))) return false
        if (data[search] === '') return false
      }

    return true    
}

function throwErrorOnMissingPostFields(data, required, res){
    if (validatePostRequest(data, required, res)) return false;

    throwDBError( `Missing POST field(s). Required: ${required}`, res);
    return true;  
}

async function dbQuery(sql, vars){
    let q_result = (await connection.promise().query(sql, vars))[0]
    log(q_result)
    log('sql: ' + sql, 3)
    log('vars: ' + vars, 3)
    log('result: ' + q_result, 3)

    return q_result
}

async function validateAndQuery(req, sql, vars, res, nocheck_vars=undefined, single=false){
    let data = req.body
    if (throwErrorOnMissingPostFields(data, vars, res)) return false
    vars = vars.map((x) => data[x])
    if (nocheck_vars) nocheck_vars.map((x) => vars.push(x))
    
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
        req, 'SELECT user_id FROM login WHERE token=?', ["token"], res
    )
    if (result) return result[0]["user_id"]
    throwDBError("Invalid token", res)
}

function responseTemplate(res, result, data){
    let json = {success: true}
    data.map((x) => json[x] = result[x])
    res.json(json)
}

function responseFail(res, result){
    if (result !== false) res.json({success:false})
}

function responseSuccess(res){
    res.json({success:true})
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

async function updateUserToken(req, uid, res){
    let token = generateUserToken();
    await validateAndQuery(req, 
        'DELETE FROM login WHERE location=? AND user_id=?',
        ["location"], res, [uid]
    )
    await validateAndQuery(req,
        'INSERT INTO login (location, user_id, token) VALUES (?, ?, ?)',
        ["location"], res, [uid, token]
    )
    return token
    
}
  

// logging functions
let log_colors = ["", "\x1b[90m", "\x1b[36m", "\x1b[33m", "\x1b[32m", "\x1b[47m\x1b[30m"]
function log(message, level=-1){
    if (LOGGING_LEVEL >= level){
        process.stdout.write(log_colors.at(level) + "[" + moment().format('YYYY-MM-DD hh:mm:ss') + "]:" + "\x1b[0m ")
        console.log(message)
    } 
}


// db business logic
async function dbPostUserDetails(req, res){
    let uid = await getUserId(req, res);
    let sql = 'SELECT username, email FROM user WHERE id=?'

    let result = await validateAndQuery(req, sql, [], res, [uid], single=true)
    responseTemplate(res, result, ["username", "email"])
}

async function dbPostUserLogin(req, res){
    let sql = 'SELECT id, password FROM user WHERE username = ?'
    let result = await validateAndQuery(req, sql, ["username"], res, [], single=true)
    if (!result) throwDBError('Invalid username or password', res)

    let uid = result.id
    let password_hash = result.password

    if (await compareHash(req.body.password, password_hash)){
        let token = await updateUserToken(req, uid, res)
        res.json({success: true, token: token})
    }
    else{
        throwDBError('Invalid username or password', res)
    }

}

async function dbPostUserRegister(req, res){
    validatePostRequest(req.body, ["password"])
    let password_hash = await generatePasswordHash(req.body.password)
    let sql = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)'
    let result = await validateAndQuery(req, sql, ["username", "email"], res, [password_hash])
    if (result){
        let uid = result.insertId
        let token = await updateUserToken(req, uid, res)
        res.json({success: true, token: token})
    }
    else responseFail(res, result)
}

async function dbPostUserMuscles(req, res){
    let uid = await getUserId(req, res)
    let sql = 'SELECT exercise_template.muscles FROM exercise INNER JOIN exercise_template ON exercise.exercise_template_id = exercise_template.id WHERE exercise_template.user_id = ?'
    let result = await validateAndQuery(req, sql, [], res, [uid])
    if (result){
        const muscles = result.map(entry => entry.muscles);
        res.json({ success: true, muscles});
    }
    else responseFail(res, result)
}

async function dbPostUserDiet(req, res){
    let uid = await getUserId(req, res)
    let sql = 'SELECT protein, carbs, fat FROM diet WHERE user_id = ? AND date=CURDATE()'
    let result = await validateAndQuery(req, sql, [], res, [uid], single=true)
    if (result){
        responseTemplate(res, result, ["protein", "carbs", "fat"])
    }
    else responseFail(res, result)
}

async function dbPostUserDietOnDate(req, res){
    let uid = await getUserId(req, res)
    let sql = 'SELECT calories, protein, carbs, fat FROM diet WHERE date=? AND user_id=?'
    let result = await validateAndQuery(req, sql, ["date"], res, [uid], single=true)
    if (result){
        responseTemplate(res, result, ["protein", "carbs", "fat"])
    }
    else responseFail(res, result)
}

async function dbPostUserDietDates(req, res){
    let uid = await getUserId(req, res)
    let sql = `SELECT date FROM diet  WHERE user_id = ?`;
    let result = await validateAndQuery(req, sql, [], res, [uid])
    if (result){
        const dates = result.map((row) => row.date); // Extract dates from the result
        res.json({success: true, dates: dates})
    }
    else responseFail(res, result)
}

async function dbPostUserDietAdd(req, res){
    let uid = await getUserId(req, res)
    let sql_current = 'SELECT id FROM diet WHERE user_id = ? AND date=CURDATE()'
    let result = await validateAndQuery(req, sql_current, [], res, [uid], single=true)
    if (result){
        // having entry for today, add values
        let sql_new = `UPDATE diet SET carbs=carbs+?, fat=fat+?, protein=protein+? WHERE id=?`
        validateAndQuery(req, sql_new, ["carbs", "fat", "protein"], res, [result.id], single=true)
    }
    else{
        // no entry for today, create new
        let sql_new = `INSERT INTO diet (carbs, fat, protein, user_id) VALUES (?, ?, ?, ?)`
        validateAndQuery(req, sql_new, ["carbs", "fat", "protein"], res, [uid], single=true)
    }
    responseSuccess(res)
}

async function dbPostUserDates(req, res){
    let uid = await getUserId(req, res)
    let sql = 'SELECT DATE_FORMAT( date, "%Y-%m-%d") as date FROM workout WHERE DATE_FORMAT( date, "%Y-%m") = ? AND user_id = ?'
    let result = await validateAndQuery(req, sql, ["date"], res, [uid])
    if (result){
        let dateArray = result.map((x) => x.date)
        res.json({success: true, dates: dateArray})
    }
    else responseFail(res, result)
}

async function dbPostUserWorkouts(req, res){
    let uid = await getUserId(req, res)
    let sql = 'SELECT workout.id, workout.duration, workout.workout_name, exercise.set_data, exercise_template.name FROM exercise INNER JOIN workout ON exercise.workout_id = workout.id INNER JOIN exercise_template ON exercise.exercise_template_id = exercise_template.id WHERE DATE_FORMAT( workout.date, "%Y-%m-%d") = ? AND workout.user_id = ?'
    let result = await validateAndQuery(req, sql, ["date"], res, [uid])
    if (result && result.length > 0){
        let workoutsArray = result.map((x) => x)
        res.json({ success: true, data: workoutsArray });
    }
    else responseFail(res, result)
}

async function dbPostSavedWorkoutTemplates(req, res){
    let uid = await getUserId(req, res)
    let sql = 'SELECT workout_template.id, workout_template.name, workout_template.comment FROM workout_template WHERE workout_template.user_id = ?'
    let result = await validateAndQuery(req, sql, [], res, [uid])

    let templates = []
    for (const template of result) {
        sql = 'SELECT exercise_template_id, set_data, comment FROM workout_template_exercises WHERE workout_template_id=?'
        let result_exercise =  await validateAndQuery(req, sql, [], res, [template.id])
        templates.push({name:template.name, comment:template.comment, data:result_exercise})
    }
    res.json({success: true, templates: templates})
}

async function dbPostExerciseTemplates(req, res){
    let sql = 'SELECT id, name, `type`, muscles FROM exercise_template'
    let result = await validateAndQuery(req, sql, [], res, [])
    let exerciesArray = result.map((x) => x)
    res.json({success: true, data: exerciesArray})
}

async function dbPostSaveWorkoutTemplate(req, res){
    // TODO: validity check on data, so insert can't fail on only some of the data
    let uid = await getUserId(req, res)
    let sql = 'INSERT INTO workout_template (name, comment, user_id) VALUES (?, ?, ?)'
    let result = await validateAndQuery(req, sql, ["name", "comment"], res, [uid])
    const workoutTemplateId = result.insertId;
    for (let exercise of req.body.data){
        let sql = 'INSERT INTO workout_template_exercises (workout_template_id, exercise_template_id, set_data, comment) VALUES (?, ?, ?, ?)'
        validateAndQuery(req, sql, [], res, [workoutTemplateId, exercise.id, JSON.stringify(exercise.set_data), exercise.comment])
    }
    responseSuccess(res)
}

async function dbPostSaveExerciseTemplate(req, res){
    let uid = await getUserId(req, res)
    let sql = 'INSERT INTO exercise_template (name, \`type\`, muscles, user_id) VALUES (?, ?, ?, ?)'

    let result = await validateAndQuery(req, sql, ["name", "type"], res, [ JSON.stringify(req.body.muscles), uid])
    if (result) {
        res.json({success: true, id: result.insertId})
    }
    else responseFail(res, result)
}