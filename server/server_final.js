const express = require('express');
const cors = require('cors');
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
app.listen(3001, () => {log(1, `Server listening on port ${3001}`);});

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


app.get('/api/user', (req, res) => getUserDetails(new User(req, res, db, log)))


app.post('/api/login', (req, res) => postLogin(new User(req, res, db, log)))
app.post('/api/signup', (req, res) => postUserRegister(new User(req, res, db, log)))
app.post('/api/workouts/dates', (req, res) => postWorkoutsDates(new User(req, res, db, log)))
app.post('/api/user/muscles', (req, res) => postUserMuscles(new User(req, res, db, log)))

// Leave at the end, otherwise captures all GET requests
app.get("*", (_, res) => {res.sendFile('index.html', { root });})


async function getUserDetails(user){
    log(2, '/api/user')

    const details = await user.userDetails()
    if (!details) return

    user.respondSuccess({username: details.username, email: details.email})
}

async function postLogin(user){
    log(2, '/api/login')

    const token = await user.login()
    if (token === false) return user.respondMissing()
    else if (token === 0) return user.respond(400, {reason: 'Invalid username or password'})

    user.respondSuccess({token: token})
}

async function postUserRegister(user){
    log('/api/signup', 2)
    const token = await user.register()
    if (token === false) return user.respondMissing()
    else if (token === 0) return user.respond(400, {reason: 'Already exists'})

    user.respondSuccess({token: token})
}


async function postWorkoutsDates(user){
    log(2, '/api/workouts/dates')

    let dates = await user.workoutDates()
    if (dates === false) return user.respondMissing()

    user.respondSuccess({dates: dates})
}


async function postUserMuscles(user){
    log(2, '/api/user/muscles')

    let userWorkouts = await user.userWorkouts()
    if (userWorkouts === false) return user.respondMissing()
    
    let exercisesDone = {}
    let musclesUsed = {}

    userWorkouts.forEach(workout => {
        workout.json.forEach(exercise => {
            let id = exercise.exercise_id
            if (!exercisesDone.hasOwnProperty(id)) exercisesDone[id] = 0
            exercisesDone[id]++
        })
    })

    for (const exerciseId of Object.keys(exercisesDone)){
        let muscles = await exercises.getMuscles(exerciseId)
        muscles.forEach(muscle => {
            if (!musclesUsed.hasOwnProperty(muscle)) musclesUsed[muscle] = 0
            musclesUsed[muscle] += exercisesDone[exerciseId]
        })
    }
    const allMusclesUsed = Object.values(exercisesDone).reduce((acc, x) => acc + x, 0)
    Object.keys(musclesUsed).forEach(muscle => {
        musclesUsed[muscle] = musclesUsed[muscle] / allMusclesUsed
        musclesUsed[muscle] = Math.min(3, Math.max(1, Math.round(musclesUsed[muscle] * 3 + 1)))
    })

    user.respondSuccess({muscles: musclesUsed})
}



