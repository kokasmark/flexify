const bcrypt = require("bcrypt")
const crypto = require('crypto')
const moment = require('moment');


class User{
    constructor(req, res, db, log){
        this.req = req
        this.res = res
        this.db = db
        this.log = log

        
        this.loggedIn = this.getUserId()
        this.admin = this.getAdmin()
        this.alreadyRes = false
    }

    async getUserId(){
        const token = this.req.get("X-Token")
        if (!token) return false
        let result = await this.db.query('SELECT user_id FROM login WHERE token = ?', [token])
        if (!result[0]) return false
        this.id = result[0].user_id
        return true
    }
    async isLoggedIn(){
        if (await this.loggedIn) return true

        this.respond(401, {reason: 'Invalid token'})
        return false
    }

    async getAdmin(){
        if (!await this.loggedIn) return false
        let result = await this.db.query('SELECT is_admin FROM user WHERE id = ?', [this.id], true)

        return !!result.is_admin
    }
    async isAdmin(){
        if (await this.admin){
            await this.db.initStructure()
            return true
        }

        this.respond(401, {reason: 'Unauthorized'})
        return false
    }

    validateFields(fieldList){
        const regex = {
            token: /^([a-f0-9]){64}$/,
            email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            //TODO: uncomment when done testing 
            //password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            password: /.*/,
            username: /^[a-zA-Z0-9._-]{5,}$/,
            date: /^[0-9]{4}(-[0-9]{1,2}){1,2}$/,
            carbs: /^[0-9]+((.|,)[0-9]+)?$/,
            fat: /^[0-9]+((.|,)[0-9]+)?$/,
            protein: /^[0-9]+((.|,)[0-9]+)?$/,
            //reset_token: /^([a-f0-9]){32}$/,
            reset_token: /^.*$/,
            login: /^(([\w-.]+@([\w-]+\.)+[\w-]{2,4})|([a-zA-Z0-9._-]{5,}))$/,
            id: /^[0-9]+$/,
            timespan: /^[0-9]+$/,
            location: /^(web)|(mobile)$/,
            time: /^.*$/,
            json: /^.*$/,
        }

        let reqFields = this.req.body
        let toReturn = {}
        for (const field of fieldList){
            if (!reqFields.hasOwnProperty(field)) return false

            if (regex.hasOwnProperty(field) && !regex[field].test(reqFields[field])) return false
            toReturn[field] = reqFields[field]
        }
        return toReturn
    }

    async workoutDates(){
        const post = this.validateFields(["date"])
        if (!post) return false
        if (!(await this.isLoggedIn())) return false

        let date = post.date.split("-")
        if (date[1].length == 1) date[1] = "0" + date[1]
        let paddedDate = `${date[0]}-${date[1]}`
        let sql = 'SELECT DATE_FORMAT(calendar.date, "%Y-%m-%d") as date FROM calendar_workout INNER JOIN calendar ON calendar_workout.calendar_id = calendar.id WHERE DATE_FORMAT( calendar.date, "%Y-%m") = ? AND calendar.user_id = ?'
        let result = await this.db.query(sql, [paddedDate, this.id])
        this.log(-1, result)
        return result.map(x => x.date)
    }

    async userWorkoutsTimespan(){
        const post = this.validateFields(["timespan"])
        if (!post) return false
        if (!(await this.isLoggedIn())) return false

        let sql = 'SELECT workout.duration, workout.json FROM calendar_workout INNER JOIN calendar ON calendar_workout.calendar_id = calendar.id INNER JOIN workout ON calendar_workout.workout_id = workout.id WHERE calendar.user_id = ? AND calendar.date >= DATE_SUB(CURDATE(), INTERVAL ? DAY) AND workout.duration != "00:00:00"'
        let result = await this.db.query(sql, [this.id, post.timespan])
        let workouts = []
        result.forEach(row => {
            row.json = JSON.parse(row.json)
            workouts.push(row)
        })
        return workouts
    }

    async userDetails(){
        if (!(await this.isLoggedIn())) return false
        let sql = 'SELECT username, email FROM user WHERE id=?'
        return this.db.query(sql, [this.id], true)

    }

    async userWorkoutsMonth(){
        const post = this.validateFields(["date"])
        if (!post) return false
        if (!(await this.isLoggedIn())) return false

        let sql = 'SELECT workout.id, workout.name, workout.json, workout.duration, workout.time FROM calendar_workout INNER JOIN workout ON calendar_workout.workout_id = workout.id INNER JOIN calendar ON calendar_workout.calendar_id = calendar.id WHERE DATE_FORMAT(calendar.date, "%Y-%m-%d") = ? AND workout.user_id = ? AND workout.duration != "00:00:00"'
        let result = await this.db.query(sql, [post.date, this.id])
        if (result && result.length > 0){
            let workoutsArray = result.map((x) => x)
            return workoutsArray
        }
        return []
    }

    async userTemplates(){
        if (!(await this.isLoggedIn())) return false

        let templates = []
        let sql = 'SELECT workout.name, workout.json FROM workout WHERE workout.duration = "00:00:00" AND workout.user_id = ?'
        let result = await this.db.query(sql, [this.id])
        for (const template of result){
            templates.push({name:template.name, json:template.json})
        }
        return templates
    }

    async login(){
        const post = this.validateFields(["username", "password", "location"])
        if (!post) return false

        let sql = 'SELECT id, password FROM user WHERE username = ?'
        let result = await this.db.query(sql, [post.username], true)
        if (!result) return 0

        const id = result.id
        const passwordHash = result.password
        if (!(await this.compareHash(post.password, passwordHash))) return 0

        const token = await this.generateToken(32)
        sql = 'DELETE FROM login WHERE location=? AND user_id=?'
        this.db.query(sql, [post.location, id], true)
        sql = 'INSERT INTO login (location, user_id, token) VALUES (?, ?, ?)'
        this.db.query(sql, [post.location, id, token], true)

        return this.updateToken(id, post.location)
    }

    async register(){
        const post = this.validateFields(["username", "email", "password", "location"])
        if (!post) return false

        let sql = 'SELECT id FROM user WHERE username = ? OR email = ?'
        let result = await this.db.query(sql, [post.username, post.email])
        if (result.length) return 0

        const passwordHash = await this.generateHash(post.password)
        sql = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)'
        result = await this.db.query(sql, [post.username, post.email, passwordHash])
        const id = result.insertId

        return this.updateToken(id, post.location)
    }

    async updateToken(id, location){
        const token = await this.generateToken(32)
        let sql = 'DELETE FROM login WHERE location=? AND user_id=?'
        this.db.query(sql, [location, id], true)
        sql = 'INSERT INTO login (location, user_id, token) VALUES (?, ?, ?)'
        this.db.query(sql, [location, id, token], true)

        return token
    }

    async getDiet(date){
        let sql = "SELECT id, diet FROM calendar WHERE user_id=? AND date=?"
        let result = await this.db.query(sql, [this.id, date], true)

        if (result === undefined) result = {id: -1, diet: ''}
        if (result.diet === ''){
            let empty = {carbs: 0, fat: 0, protein: 0}
            result.diet = {breakfast: empty, lunch: empty, dinner: empty, snacks: empty}
        }
        else result.diet = JSON.parse(result.diet)

        return result
    }

    async diet(){
        const post = this.validateFields(["date"])
        if (!post) return false
        if (!await this.isLoggedIn()) return false

        const result = await this.getDiet(post.date)
        return result.diet
    }

    async dietAdd(){
        const post = this.validateFields(["json"])
        if (!post) return false
        if (!await this.isLoggedIn()) return false

        let result = await this.getDiet(moment().format('YYYY-MM-DD'))
        this.log(-1, result)
        if (result.id === -1){
            let sql ="INSERT INTO calendar (user_id, date, diet) VALUES (?, CURDATE(), ?)"
            await this.db.query(sql, [this.id, JSON.stringify(post.json)])
            return
        }

        Object.entries(result.diet).forEach(([key, value]) => {
            post.json[key].carbs += value.carbs
            post.json[key].fat += value.fat
            post.json[key].protein += value.protein
        })

        let sql = `UPDATE calendar SET diet=? WHERE id=?`
        await this.db.query(sql, [JSON.stringify(post.json), result.id])

        return true
    }

    async dietAll(){
        if (!await this.isLoggedIn()) return false

        let sql = "SELECT date, carbs, fat, protein FROM calendar WHERE user_id=?"
        return await this.db.query(sql, [this.id])
    }

    async saveWorkout(){
        const post = this.validateFields(["duration", "name", "json", "time"])
        if (!post) return false
        if (!await this.isLoggedIn()) return false

        let sql = 'INSERT INTO workout (user_id, duration, name, json, time) VALUES (?, ?, ?, ?, ?)'
        let result = await this.db.query(sql, [this.id, post.duration, post.name, post.json, post.time])

        let workoutId = result.insertId
        sql = "SELECT id FROM calendar WHERE user_id=? AND date=CURDATE()"
        result = await this.db.query(sql, [this.id])
        if (!result.length){
            sql ="INSERT INTO calendar (user_id, date, protein, carbs, fat) VALUES (?, CURDATE(), 0, 0, 0)"
            result = await this.db.query(sql, [this.id])
        }
        const calendarId = result.length ? result[0].id : result.insertId

        sql = 'INSERT INTO calendar_workout (calendar_id, workout_id) VALUES (?, ?)'
        this.db.query(sql, [calendarId, workoutId])
        
        return true
    }

    async saveTemplate(){
        const post = this.validateFields(["name", "json"])
        if (!post) return false
        if (!await this.isLoggedIn()) return false

        let sql = 'INSERT INTO workout (user_id, name, json) VALUES (?, ?, ?)'
        let result = await this.db.query(sql, [this.id, post.name, post.json])

        let workoutId = result.insertId
        sql = "SELECT id FROM calendar WHERE user_id=? AND date=CURDATE()"
        result = await this.db.query(sql, [this.id])
        if (!result.length){
            sql ="INSERT INTO calendar (user_id, date, protein, carbs, fat) VALUES (?, CURDATE(), 0, 0, 0)"
            result = await this.db.query(sql, [this.id])
        }
        const calendarId = result.length ? result[0].id : result.insertId
        
        sql = 'INSERT INTO calendar_workout (calendar_id, workout_id) VALUES (?, ?)'
        this.db.query(sql, [calendarId, workoutId])
        
        return true
    }


    async deleteExpiredResetTokens(){
        let sql = 'DELETE FROM login_reset WHERE created < (CURRENT_TIMESTAMP()  - INTERVAL 10 MINUTE);'
        return this.db.query(sql)
    }

    async validateResetToken(){
        let post = this.validateFields(["reset_token"])
        if (!post) return false

        await this.deleteExpiredResetTokens()
        let sql = 'SELECT user_id FROM login_reset WHERE token = ?;'
        let result = await this.db.query(sql, [post.reset_token])

        if (!result.length) return false
        return true
    }

    async generateResetToken(serverUrl){
        const post = this.validateFields(["user"])
        if (!post) return false
        this.deleteExpiredResetTokens()

        let sql = "SELECT id, username, email FROM user WHERE username=? OR email=?"
        let result = await this.db.query(sql, [post.user, post.user])
        if (!result.length) return false

        const id = result[0].id
        const reset_token = await this.generateToken(16)
        this.sendRequest('POST', serverUrl, {username: result[0].username, email: result[0].email, token: reset_token})

        sql = "INSERT INTO login_reset (user_id, token) VALUES (?, ?)"
        this.db.query(sql, [id, reset_token])

        return true
    }

    async resetPassword(){
        const post = this.validateFields(["password", "reset_token"])
        if (!post) return false
        this.log(-1, 'ok')

        let sql = 'SELECT user_id FROM login_reset WHERE token = ?'
        let result = await this.db.query(sql, [post.reset_token])
        if (result.length == 0) return false
        const id = result[0].user_id
        const hash = await this.generateHash(post.password)
        this.db.query('UPDATE user SET password=? WHERE id=?', [hash, id])
        this.db.query('DELETE FROM login_reset WHERE token=?', [post.reset_token])

        return true
    }



    async getTables(){
        if (!await this.isAdmin()) return false
        return Object.keys(this.db.structure)
    }


    async generateHash(password){
        return bcrypt.hash(password, 10).catch(err => log(1, err))
    }
    async compareHash(password, hash){
        return await (bcrypt.compare(password, hash).catch(err => this.log(1, err)))
    }
    async generateToken(length){
        return crypto.randomBytes(length).toString('hex');
    }
    


    respond(response_code, json={}){
        json.success = false
        if (response_code == 200) json.success = true

        if (!this.alreadyRes){
            this.res.status(response_code).json(json)
            this.alreadyRes = true
        }
    }
    respondSuccess(json={}){
        json.success = true
        this.respond(200, json)
    }
    respondMissing(){
        
        this.respond(400, {reason: 'Missing or invalid POST field(s)', success: false})
    }


    sendRequest(method, url, body){
        const request = require('request')
        const options = {
            'method': method,
            'url': url,
            'headers': {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        }
        request(options, function (error) {
            if (error) throw new Error(error);
        })
    
    }

}

module.exports = User