class Test{
    constructor(username, email, password, debug){
        this.data = {}
        this.userData = {
            username: username,
            email: email,
            password: password,

            workoutName: 'Testing...',
            workoutJson: JSON.stringify([
                {
                    "exercise_id": 1,
                    "set_data":[{"reps":"10","weight":"50"},{"reps":"9","weight":"50"}]
                },
                {
                    "exercise_id": 2,
                    "set_data":[{"reps":"10","weight":"100"},{"reps":"9","weight":"100"}]
                },
                {
                    "exercise_id": 3,
                    "set_data":[{"duration": 10},{"duration": 20}]
                }
            ]),
            workoutDuration: '10:10:10'
        }
        this.debug = debug

    }

    async runTests(){
        await this.delay(1000)
        await this.callAPIs()
        if (this.debug) console.log(this.data)

        const test = require('node:test')
        const assert = require('node:assert')

        test('Testing register and login', t => {
            assert.ok(this.data.register)
            assert.strictEqual(this.data.login.status, 200)
            assert.strictEqual(this.data.user.status, 200)

            assert.ok(this.data.user.username)
            assert.ok(this.data.user.email)
            assert.ok(this.userData.token)

            assert.strictEqual(this.data.user.username, this.userData.username)
            assert.strictEqual(this.data.user.email, this.userData.email)
        })

        test('Testing diet', t => {
            assert.strictEqual(this.data.dietFirst.status, 200)
            assert.strictEqual(this.data.dietSecond.status, 200)
            assert.strictEqual(this.data.dietAdd.status, 200)

            assert.deepStrictEqual(this.data.dietSecond, {
                status: 200,
                carbs: this.data.dietFirst.carbs + this.data.dietSecond.carbs, 
                fat: this.data.dietFirst.fat + this.data.dietSecond.fat,
                protein: this.data.dietFirst.protein + this.data.dietSecond.protein})
        })
        
        test('Testing templates', t =>{
            assert.strictEqual(this.data.templateSave.status, 200)
            assert.strictEqual(this.data.templateGet.status, 200)
            
            assert.ok(this.data.templateGet.templates)

            assert.deepStrictEqual(this.data.templateGet, {status:200, templates: [{json:this.userData.workoutJson, name:this.userData.workoutName}]})
        })

        test('Testing workouts', t =>{
            assert.strictEqual(this.data.workoutSave.status, 200)
            assert.strictEqual(this.data.workoutGet.status, 200)

            assert.ok(this.data.workoutGet.data)

            assert.strictEqual(this.data.workoutGet.data[0].name, this.userData.workoutName)
            assert.strictEqual(this.data.workoutGet.data[0].json, this.userData.workoutJson)
            assert.strictEqual(this.data.workoutGet.data[0].duration, this.userData.workoutDuration)
        })


    }

    sendRequest(method, path, body, dataKey){
        const options = {
            method: method,
            url: 'http://localhost:3001' + path,
            headers: {'content-type' : 'application/json', 'X-Token': this.userData.token},
            body: JSON.stringify(body),
        };

        const self = this
        const request = require('request')
        request(options, function (error, response) {
            if (error) throw new Error(error)
            self.data[dataKey] = JSON.parse(response.body)
            self.data[dataKey].status = response.statusCode
        });
    }

    async callAPIs(){
        
        this.sendRequest('POST', '/api/signup', {username: this.userData.username, email: this.userData.email, password: this.userData.password, location: "web"}, "register")
        await this.delay(500)
        this.sendRequest('POST', '/api/login', {username: this.userData.username, password: this.userData.password, location: "web"}, "login")

        await this.waitForToken()

        this.sendRequest('GET', '/api/user', {}, "user")

        const date = new Date().toISOString().slice(0,10)
        this.sendRequest('POST', '/api/diet', {date: date}, "dietFirst")
        this.sendRequest('POST', '/api/diet/add', {carbs: 100, fat: 90, protein: 80}, "dietAdd")
        await this.delay(200)
        this.sendRequest('POST', '/api/diet', {date: date}, "dietSecond")

        this.sendRequest('POST', '/api/templates/save', {name: this.userData.workoutName, json: this.userData.workoutJson}, "templateSave")
        this.sendRequest('POST', '/api/workouts/save', {name: this.userData.workoutName, json: this.userData.workoutJson, duration: this.userData.workoutDuration}, "workoutSave")
        await this.delay(300)
        this.sendRequest('GET', '/api/templates', {}, "templateGet")
        this.sendRequest('POST', '/api/workouts/data', {date: date}, "workoutGet")
        

        await this.delay(1000)

        return 1
    }

    async waitForToken(){
        while (!this.data.login){
            await this.delay(10)
        }
        this.userData.token = this.data.login.token
        return
    }

    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}

module.exports = Test