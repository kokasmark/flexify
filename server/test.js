class Test{
    constructor(username, email, password, debug){
        this.responses = {}
        this.badResponses = {}
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
            workoutDuration: '10:10:10',
            date: new Date().toISOString().slice(0,10)
        }
        this.debug = debug

    }

    async runTests(){
        await this.delay(1000)
        await this.callAPIs()
        if (this.debug) {
            console.log("----\tResponses:")
            console.log(this.responses)
            console.log("----\tBad responses:")
            console.log(this.badResponses)
        }

        const test = require('node:test')
        const assert = require('node:assert')

        test('Testing register and login', t => {
            assert.ok(this.responses.register)
            assert.strictEqual(this.responses.loginWeb.status, 200)
            assert.strictEqual(this.responses.loginMobile.status, 200)
            assert.strictEqual(this.responses.user.status, 200)

            assert.ok(this.responses.user.username)
            assert.ok(this.responses.user.email)
            assert.ok(this.userData.token)

            assert.strictEqual(this.responses.user.username, this.userData.username)
            assert.strictEqual(this.responses.user.email, this.userData.email)
        })
        
        // test('Testing diet', t => {
        //     assert.strictEqual(this.responses.dietFirst.status, 200)
        //     assert.strictEqual(this.responses.dietSecond.status, 200)
        //     assert.strictEqual(this.responses.dietAdd.status, 200)

        //     assert.deepStrictEqual(this.responses.dietSecond, {
        //         status: 200,
        //         carbs: this.responses.dietFirst.carbs + this.responses.dietSecond.carbs, 
        //         fat: this.responses.dietFirst.fat + this.responses.dietSecond.fat,
        //         protein: this.responses.dietFirst.protein + this.responses.dietSecond.protein})
        // })
        
        test('Testing templates', t =>{
            assert.strictEqual(this.responses.templateSave.status, 200)
            assert.strictEqual(this.responses.templateGet.status, 200)
            
            assert.ok(this.responses.templateGet.templates)

            assert.deepStrictEqual(this.responses.templateGet, {status:200, templates: [{json:this.userData.workoutJson, name:this.userData.workoutName}]})
        })

        test('Testing workouts', t =>{
            assert.strictEqual(this.responses.workoutSave.status, 200)
            assert.strictEqual(this.responses.workoutGet.status, 200)
            assert.strictEqual(this.responses.workoutGetWrongDate.status, 200)

            assert.ok(this.responses.workoutGet.data)
            assert.ok(this.responses.workoutGetWrongDate.data)

            assert.strictEqual(this.responses.workoutGet.data[0].name, this.userData.workoutName)
            assert.strictEqual(this.responses.workoutGet.data[0].json, this.userData.workoutJson)
            assert.strictEqual(this.responses.workoutGet.data[0].duration, this.userData.workoutDuration)

            assert.strictEqual(this.responses.workoutGetWrongDate.data.length, 0)
        })

        test('Testing bad register and login requests', t => {
            assert.notStrictEqual(this.badResponses.register1.status, 200)
            assert.notStrictEqual(this.badResponses.register2.status, 200)
            assert.notStrictEqual(this.badResponses.register3.status, 200)
            assert.notStrictEqual(this.badResponses.register4.status, 200)
            assert.notStrictEqual(this.badResponses.register5.status, 200)
            assert.notStrictEqual(this.badResponses.register6.status, 200)
            assert.notStrictEqual(this.badResponses.register7.status, 200)

            assert.notStrictEqual(this.badResponses.login1.status, 200)
            assert.notStrictEqual(this.badResponses.login2.status, 200)
            assert.notStrictEqual(this.badResponses.login3.status, 200)


        })


    }

    sendRequest(method, path, body, responseKey, isBadRequest=false, skipToken=false){
        const options = {
            method: method,
            url: 'http://localhost:3001' + path,
            headers: {'content-type' : 'application/json', 'X-Token': skipToken ? "" : this.userData.token},
            body: JSON.stringify(body),
        };

        const self = this
        const request = require('request')
        const responseObj = isBadRequest ? self.badResponses : self.responses
        request(options, function (error, response) {
            if (error) throw new Error(error)
            responseObj[responseKey] = JSON.parse(response.body)
            responseObj[responseKey].status = response.statusCode
        });
    }

    async callAPIs(){
        this.sendRequest('POST', '/api/signup', {username: "", email: this.userData.email, password: this.userData.password, location: "web"}, "register1", true)
        this.sendRequest('POST', '/api/signup', {username: "tesztuser$", email: this.userData.email, password: this.userData.password, location: "web"}, "register2", true)
        this.sendRequest('POST', '/api/signup', {username: this.userData.username, email: "abc123", password: this.userData.password, location: "web"}, "register3", true)
        this.sendRequest('POST', '/api/signup', {username: this.userData.username, email: "abc@123", password: this.userData.password, location: "web"}, "register4", true)
        this.sendRequest('POST', '/api/signup', {username: this.userData.username, email: "abc@123.c", password: this.userData.password, location: "web"}, "register5", true)
        this.sendRequest('POST', '/api/signup', {username: this.userData.username, email: "abc@123.c", password: this.userData.password, location: ""}, "register6", true)
        this.sendRequest('POST', '/api/signup', {username: this.userData.username, email: "abc@123.c", password: this.userData.password, location: "egyeb"}, "register7", true)

        this.sendRequest('POST', '/api/signup', {username: this.userData.username, email: this.userData.email, password: this.userData.password, location: "web"}, "register")
        await this.delay(500)

        this.sendRequest('POST', '/api/login', {username: this.userData.username, password: "", location: "web"}, "login1", true)
        this.sendRequest('POST', '/api/login', {username: this.userData.username, password: this.userData.password}, "login2", true)
        this.sendRequest('POST', '/api/login', {password: this.userData.password, location: "web"}, "login3", true)

        this.sendRequest('POST', '/api/login', {username: this.userData.username, password: this.userData.password, location: "mobile"}, "loginMobile")
        this.sendRequest('POST', '/api/login', {username: this.userData.username, password: this.userData.password, location: "web"}, "loginWeb")
        await this.waitForToken()

        this.sendRequest('GET', '/api/user', {}, "user", true, true)

        this.sendRequest('GET', '/api/user', {}, "user")

        // this.sendRequest('POST', '/api/diet', {date: this.userData.date}, "dietFirst")
        // this.sendRequest('POST', '/api/diet/add', {carbs: 100, fat: 90, protein: 80}, "dietAdd")
        // await this.delay(200)
        // this.sendRequest('POST', '/api/diet', {date: this.userData.date}, "dietSecond")

        this.sendRequest('POST', '/api/templates/save', {name: this.userData.workoutName, json: this.userData.workoutJson}, "templateSave")
        this.sendRequest('POST', '/api/workouts/save', {name: this.userData.workoutName, json: this.userData.workoutJson, duration: this.userData.workoutDuration}, "workoutSave")
        await this.delay(300)
        this.sendRequest('GET', '/api/templates', {}, "templateGet")
        this.sendRequest('POST', '/api/workouts/data', {date: this.userData.date}, "workoutGet")
        this.sendRequest('POST', '/api/workouts/data', {date: "2024-02-20"}, "workoutGetWrongDate")
        

        await this.delay(1000)

        return 1
    }

    async waitForToken(){
        while (!this.responses.loginWeb){
            await this.delay(10)
        }
        this.userData.token = this.responses.loginWeb.token
        return
    }

    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}

module.exports = Test