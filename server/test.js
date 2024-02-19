class Test{
    constructor(){
        this.test = require('node:test')
        this.data = {}

        this.runTests()
        // this.sendRequest('GET', '/api/user', '9767afbb0ec883ba2e896b07f72237b0b2c9a0ade7a796b438789f64386bb5f1', this.testLogin)
    }

    sendRequest(method, path, body, token,  callback, self){
        console.log('---------------')
        console.log(body)
        console.log(method)
        var request = require('request');
        var options = {
        'method': method,
        'url': 'http://localhost:3001' + path,
        'headers': {},
        'body': JSON.stringify(body)
        };
        if (token) options.headers['X-Token'] = token
        
        request(options, function (error, response) {
            if (error) throw new Error(error);
            callback(response.body, self);
        });
    }

    runTests(){
        // TODO: fix THIS shit
        this.sendRequest('POST', '/api/login', {"username": "gipsz_jakab", "password": "teszt"}, undefined, this.testUserLogin, this)
        this.sendRequest('GET', '/api/user', {}, this.data.token, this.testUserData, this)
    }

    testUserLogin(response, self){
        self.data.token = response.token
    }

    testUserData(response, self){
        if (!response.hasOwnProperty("username") || !response.hasOwnProperty("email")) return
        self.data.userData = true
    }


}

module.exports = Test