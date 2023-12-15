const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require("bcrypt");


// setup server and database connection
// use DEBUG_MODE to send back error messages to client
const DEBUG_MODE = true;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const root = require('path').join(__dirname, 'build')
app.use(express.static(root));
app.get("*", (req, res) => {res.sendFile('index.html', { root });})
app.listen(3001, () => {console.log(`Server listening on port ${3001}`);});
const connection = createConnection()


// setup api paths


// basic database functions
function createConnection(){
    let connection = mysql.createConnection({
        host: 'bgs.jedlik.eu',
        user: 'flexify',
        password: 'FlFy2023',
        database: 'flexify',
      });
    connection.connect((err) => {
    if (err) console.error('Error connecting to MySQL:', err);
    else     console.log('Connected to MySQL');
    });

    return connection
}

function throwDBError(res, error){
    let msg = 'Internal Server Error';
    if (debugMode) msg += ': ' + error;
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
    if (validatePostRequest(data, required, res, strict)) return false;

    throwDBError(res, "Missing POST field(s)");
    return true;  
}


// hashing functions
function generatePasswordHash(password){
    return bcrypt.hash(password, 10).catch(err => console.log(err))
}

function compareHash(password, hash){
    let result = (bcrypt.compare(password, hash).catch(err => console.log(err)))
    return result
}

function generateUserToken(){
    return require('crypto').randomBytes(32).toString('hex');
  }
  
  