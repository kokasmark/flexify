const express = require('express');
const cors = require('cors');
const bcrypt = require("bcrypt");
const moment = require('moment');
const dotenv = require('dotenv');
const DB = require('./db.js')
const User = require('./user.js')

const app = express();
const root = require('path').join(__dirname, 'build')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(root));
app.get("*", (_, res) => {res.sendFile('index.html', { root });})
app.listen(3001, () => {console.log(`Server listening on port ${3001}`);});

dotenv.config();
const DEBUG_LEVEL = process.env.DEBUG_LEVEL
const DEBUG_RESPONSE = process.env.DEBUG_RESPONSE
const db = new DB(log)
function log(level, message){
    const log_colors = ["\x1b[31m", "\x1b[90m", "\x1b[36m", "\x1b[33m", "\x1b[32m", "\x1b[47m\x1b[30m"]
    if (DEBUG_LEVEL >= level){
        process.stdout.write(log_colors.at(level) + "[" + moment().format('YYYY-MM-DD hh:mm:ss') + "]:\x1b[0m ")
        console.log(message)
    } 
}

app.post('/api/workouts/dates', (req, res) => postUserDates(new User(req, res, db, log)))


async function postUserDates(user){
    let dates = await user.workoutDates()
    if (dates === false) return user.respondMissing()

    let dateArray = dates.map((x) => x.date)
    user.respondSuccess({dates: dateArray})
}



