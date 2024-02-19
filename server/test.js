class Test{
    constructor(){
        this.test = require('node:test')
        this.data = {}

        this.callAPIs()
        // this.sendRequest('GET', '/api/user', '9767afbb0ec883ba2e896b07f72237b0b2c9a0ade7a796b438789f64386bb5f1', this.testLogin)
    }

    runTests(self){
        console.log(self.data)
    }

    sendRequest(method, path, body, token,  callback){
        const options = {
            'method': method,
            'url': 'http://localhost:3001' + path,
            'headers': {'content-type' : 'application/json'},
            'body': JSON.stringify(body),
            
        };
        if (token) options.headers['X-Token'] = this.data.token
        
        console.log(`${path}:\t${this.data.token}`)

        const self = this
        const request = require('request')
        request(options, function (error, response) {
            if (error) throw new Error(error);
            callback(JSON.parse(response.body), self);
        });
    }

    async callAPIs(){
        this.sendRequest('POST', '/api/signup', {username: "teszt123", email: "teszt@teszt.com", password: "teszt", location: "web"}, false, this.testRegister)
        this.sendRequest('POST', '/api/login', {username: "gipsz_jakab", password: "teszt", location: "web"}, false, this.testLogin)

        await this.isTokenSet() // wait for user token, all the calls below need it
        this.sendRequest('GET', '/api/user', {}, true, this.testUser)

        const self = this
        const callback = this.runTests
        setTimeout(function(){callback(self)}, 3000)
    }

    testRegister(response, self){
        self.data.register = response
    }

    testLogin(response, self){
        self.data.token = response.token
        self.data.login = response
    }

    testUser(response, self){
        self.data.user = response
    }

    async isTokenSet(){
        while (!this.data.login){
            await this.delay(0.1)
        }
        return
    }

    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    



}

module.exports = Test