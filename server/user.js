class User{
    constructor(req, res, db, log){
        this.req = req
        this.res = res
        this.db = db
        this.log = log
        
        this.loggedIn = this.getUserId()
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

    validateFields(fieldList){
        const regex = {
            token: /^([a-f0-9]){64}$/,
            email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            username: /^[a-zA-Z0-9._\-]{5,}$/,
            date: /^[0-9]{4}(-[0-9]{2}){1,2}$/,
            carbs: /^[0-9]+((.|,)[0-9]+)?$/,
            fat: /^[0-9]+((.|,)[0-9]+)?$/,
            protein: /^[0-9]+((.|,)[0-9]+)?$/,
            reset_token: /^([a-f0-9]){32}$/,
            login: /^(([\w-\.]+@([\w-]+\.)+[\w-]{2,4})|([a-zA-Z0-9._\-]{5,}))$/,
            id: /^[0-9]+$/,
            timespan: /^[0-9]+$/
        }

        let reqFields = this.req.body
        let toReturn = {}
        for (const field of fieldList){
            if (!reqFields.hasOwnProperty(field)) return false
            if (!regex[field].test(reqFields[field])) return false
            toReturn[field] = reqFields[field]
        }
        return toReturn
    }


    async isLoggedIn(){
        if (await this.loggedIn) return true
        else {
            this.respond(401, {reason: 'Invalid token'})
            return false
        }
    }

    async workoutDates(){
        const post = this.validateFields(["date"])
        if (!post) return false
        if (!(await this.isLoggedIn())) return false

        let sql = 'SELECT DATE_FORMAT(calendar.date, "%Y-%m-%d") as date FROM calendar_workout INNER JOIN calendar ON calendar_workout.calendar_id = calendar.id WHERE DATE_FORMAT( date, "%Y-%m") = ? AND calendar.user_id = ?'
        let result = await this.db.query(sql, [post.date, this.id])
        return result.map(x => x.date)
    }


    async userWorkouts(){
        const post = this.validateFields(["timespan"])
        if (!post) return false
        if (!(await this.isLoggedIn())) return false

        let sql = 'SELECT finished_workout.duration, finished_workout.json FROM calendar_workout INNER JOIN calendar ON calendar_workout.calendar_id = calendar.id INNER JOIN finished_workout ON calendar_workout.finished_workout_id = finished_workout.id WHERE calendar.user_id = ? AND calendar.date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)'
        let result = await this.db.query(sql, [this.id, post.timespan])
        let workouts = []
        result.forEach(row => {
            row.json = JSON.parse(row.json)
            workouts.push(row)
        })
        return workouts
    }


    respond(response_code, json){
        if (!this.alreadyRes){
            this.res.status(response_code).json(json)
            this.alreadyRes = true
        }
    }

    respondSuccess(json){
        this.respond(200, json)
    }

    respondMissing(){
        this.respond(400, {reason: 'Missing or invalid POST field(s)'})
    }
}

module.exports = User