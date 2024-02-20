class Test{
    constructor(username, email, password){
        this.data = {}
        this.userData = {
            username: username,
            email: email,
            password: password,
        }

    }

    async runTests(){
        await this.delay(1000)
        await this.callAPIs()
        const test = require('node:test')
        const assert = require('node:assert')

        console.log(this.data)
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

            assert.ok(this.data.dietSecond, {
                status: 200,
                carbs: this.data.dietFirst.carbs + this.data.dietSecond.carbs, 
                fat: this.data.dietFirst.fat + this.data.dietSecond.fat,
                protein: this.data.dietFirst.protein + this.data.dietSecond.protein})

        })


    }

    sendRequest(method, path, body, token,  dataKey){
        const options = {
            'method': method,
            'url': 'http://localhost:3001' + path,
            'headers': {'content-type' : 'application/json'},
            'body': JSON.stringify(body),
            
        };
        if (token) options.headers['X-Token'] = this.userData.token
        
        const self = this
        const request = require('request')
        request(options, function (error, response) {
            if (error) throw new Error(error);
            self.data[dataKey] = JSON.parse(response.body)
            self.data[dataKey].status = response.statusCode
        });
    }

    async callAPIs(){
        const date = new Date().toISOString().slice(0,10);
        this.sendRequest('POST', '/api/signup', {username: this.userData.username, email: this.userData.email, password: this.userData.password, location: "web"}, false, "register")
        await this.delay(500)

        this.sendRequest('POST', '/api/login', {username: this.userData.username, password: this.userData.password, location: "web"}, false, "login")
        await this.waitForToken()
        this.sendRequest('GET', '/api/user', {}, true, "user")

        this.sendRequest('POST', '/api/diet', {date: date}, true, "dietFirst")
        this.sendRequest('POST', '/api/diet/add', {carbs: 100, fat: 90, protein: 80}, true, "dietAdd")
        await this.delay(100)
        this.sendRequest('POST', '/api/diet', {date: date}, true, "dietSecond")

        await this.delay(1000)

        return 1
    }

    async waitForToken(){
        while (!this.data.login){
            await this.delay(0.1)
        }
        this.userData.token = this.data.login.token
        return
    }

    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}

module.exports = Test