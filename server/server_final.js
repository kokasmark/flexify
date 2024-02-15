const express = require('express');
const cors = require('cors');
const bcrypt = require("bcrypt");
const moment = require('moment');
const dotenv = require('dotenv');
const DB = require('./db.js')
const User = require('./user.js');
const Exercises = require('./exercises.js');

const app = express();
const root = require('path').join(__dirname, 'build')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(root));
app.listen(3001, () => {console.log(`Server listening on port ${3001}`);});

dotenv.config();
const DEBUG_LEVEL = process.env.DEBUG_LEVEL
const DEBUG_RESPONSE = process.env.DEBUG_RESPONSE
const db = new DB(log)
const exercises = new Exercises(db)
function log(level, message){
    const log_colors = ["\x1b[31m", "\x1b[90m", "\x1b[36m", "\x1b[33m", "\x1b[32m", "\x1b[47m\x1b[30m"]
    if (DEBUG_LEVEL >= level){
        process.stdout.write(log_colors.at(level) + "[" + moment().format('YYYY-MM-DD hh:mm:ss') + "]:\x1b[0m ")
        console.log(message)
    } 
}

app.get("*", (_, res) => {res.sendFile('index.html', { root });})
app.post('/api/workouts/dates', (req, res) => postUserDates(new User(req, res, db, log)))


async function postUserDates(user){
    log(2, '/api/workouts/dates')
    let dates = await user.workoutDates()
    if (dates === false) return user.respondMissing()

    let dateArray = dates.map((x) => x.date)
    user.respondSuccess({dates: dateArray})
}


async function dbPostUserMuscles(req, res){
    log(2, '/api/home/muscles')
    
    const Exercises = new Map()
    const AveragedExercises = new Map()
    const FinalExercises = new Map()

    let sql = 'SELECT finished_workout.json FROM calendar_workout INNER JOIN calendar ON calendar_workout.calendar_id = calendar.id INNER JOIN finished_workout ON calendar_workout.finished_workout_id = finished_workout.id WHERE calendar.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND calendar.user_id = ?'
    let result = await validateAndQuery(req, res, sql, [], [], single=false, user_id=true)
    if (result === false) return responseFail(res)

    result.forEach(row => {
        let data = JSON.parse(row.json)
        data.forEach(entry => {
            let id = entry.exercise_id
            if (!Exercises.has(id)) Exercises.set(id, 0)
            Exercises.set(id, Exercises.get(id)+1);
        });
    });

    sql = 'SELECT json, id FROM exercise'
    result = await validateAndQuery(req, res, sql, [], [])
    if (result === false) return responseFail(res)

    result.forEach(row => {
        Exercises.forEach((value, id) => {
            if (row.id == id){
                JSON.parse(row.json).muscles.forEach(muscle => {
                    AveragedExercises.set(muscle, value / Exercises.size)
                })
            }
        })
    })

    AveragedExercises.forEach((value, name) => {
        FinalExercises.set(name, Math.min(3, Math.max(1, Math.round(value * 3 + 1)) ))
    })
    responseJson(res, SUCCESS, Object.fromEntries(FinalExercises))
}



