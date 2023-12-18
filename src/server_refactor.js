const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require("bcrypt");


// use DEBUG_MODE to send back error messages to client
// LOGGING_LEVEL 0 = nothing, 1 = connect to db, new connections, db errors; 2=function calls, 3=sql commands, query responses
const RESPONSE_DEBUG_MODE = true;
const LOGGING_LEVEL = 4;


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

async function responseTemplate(res, result, data){
    let json = {success: true}
    data.map((x) => json[x] = result[x])
    res.json(json)
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
function log(message, level){
    if (LOGGING_LEVEL >= level) console.log(message)
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
    else {
        res.json({success: false})
    }
}