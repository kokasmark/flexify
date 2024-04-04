const { Builder, Browser, By, Key, until } = require('selenium-webdriver')
const test = require('node:test')
const assert = require('node:assert')

async function runTests(){
    let driver = await new Builder().forBrowser(Browser.CHROME).build()
    try {
        await driver.get('http://localhost:3000')
        await driver.wait(until.elementLocated(By.className('swal-text')))
        let el = await driver.findElement(By.className('swal-button swal-button--confirm'))
        await driver.executeScript("arguments[0].click()", el)
        // login page


        let username = await driver.findElement(By.id('username'))
        let password = await driver.findElement(By.id('password'))
        let submit = await driver.findElement(By.className('btn btn-primary'))

        await username.sendKeys('gipsz_jakab')
        await password.sendKeys('teszt')
        await driver.executeScript("arguments[0].click()", submit)
        await driver.wait(until.elementLocated(By.className('muscles anim load-anim fade-in')))
        // home page
        
        // await delay(2000)
        let timePeriodDiv = await driver.findElement(By.className('timePeriod load-anim'))
        let timePeriods = await timePeriodDiv.findElements(By.className('interactable'))
        console.log('ok')
        timePeriods.forEach(async el => {
            console.log(await el.getText())
        })
        await delay(2000)

        await driver.get('http://localhost:3000/plan')
        await driver.wait(until.elementLocated(By.className('rbc-toolbar-label')))
        // calendar page


        await driver.get('http://localhost:3000/create')
        await driver.wait(until.elementLocated(By.className('create-workout anim')))
        // create page

        
        await driver.get('http://localhost:3000/browse')
        await driver.wait(until.elementLocated(By.className('browse-muscle')))
        // create page


        await driver.get('http://localhost:3000/diet')
        await driver.wait(until.elementLocated(By.className('plate-container')))
        // calendar page


        await driver.get('http://localhost:3000/saved')
        await driver.wait(until.elementLocated(By.className('saved-workouts')))
        // workouts page


        await driver.get('http://localhost:3000/account')
        await driver.wait(until.elementLocated(By.className('load-anim account-details')))
        // account page




    } finally {
    //   await driver.quit()
    }
  
}

async function delay(time){
    return new Promise((resolve) => {
        setTimeout(resolve, time);
      });    
}

runTests()