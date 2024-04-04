const { Builder, Browser, By, Key, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome');
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
        let textCards = await driver.findElements(By.className('card-text'))
        let interactables = await driver.findElements(By.className('interactable'))

        test('Testing login page', _ => {
            assert.equal(textCards.length, 3)
            assert.equal(interactables.length, 3)
        })

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
        await driver.wait(until.elementIsVisible(timePeriodDiv))
        let timePeriods = await timePeriodDiv.findElements(By.className('interactable'))
        let timePeriodTexts = await Promise.all(timePeriods.map(async el => await el.getText()))
        let muscles = await driver.findElements(By.className('muscles'))
        let welcomeText =await driver.findElement(By.className('navbar-welcome')).getText()

        test("Testing home page", _ => {
            assert.deepEqual(timePeriodTexts, ['Heti', 'Havi', 'Fél éves', 'Éves', 'Összes'])
            assert.ok(muscles.length),
            assert.equal(welcomeText, 'Üdvözöljük, gipsz_jakab')
        })

        await driver.get('http://localhost:3000/plan')
        await driver.wait(until.elementLocated(By.className('rbc-toolbar-label')))
        // calendar page
        let toolbar = await driver.findElement(By.className('rbc-toolbar'))
        let toolbarButtons = await toolbar.findElements(By.tagName('button'))

        test("Testing calendar", _ => {
            assert.ok(toolbar),
            assert.equal(toolbarButtons.length, 5)
        })


        await driver.get('http://localhost:3000/create')
        await driver.wait(until.elementLocated(By.className('create-workout anim')))
        // create page
        let createTemplates = await driver.findElement(By.className('anim create-templates'))
        await driver.wait(until.elementIsVisible(createTemplates))
        let createTemplatesText = await createTemplates.getText()
        let createDrop = await driver.findElement(By.className('create-workout anim'))

        test("Testing create page", _ => {
            assert.ok(createTemplates)
            assert.equal(createTemplatesText, 'Gyakorlatok')
            assert.ok(createDrop)
        })

        
        await driver.get('http://localhost:3000/browse')
        await driver.wait(until.elementLocated(By.className('browse-muscle')))
        // browse page
        let browseHeader = await driver.findElement(By.className('browse-page-header'))
        await driver.wait(until.elementIsVisible(browseHeader))
        let browseHeaderText = await browseHeader.getText()
        test("Testing browse page", _ => {
            assert.ok(browseHeader)
            assert.equal(browseHeaderText, "Browse Exercises\nClick on a muscle to list the exercises that work on it.")
        })


        await driver.get('http://localhost:3000/diet')
        await driver.wait(until.elementLocated(By.className('plate-container')))
        // diet page
        let dietDate = await driver.findElement(By.className('diet-date'))
        let plates = await driver.findElements(By.className('diet-plate interactable'))

        test("testing diet page", _ => {
            assert.ok(dietDate)
            assert.equal(plates.length, 4)
        })
        


        await driver.get('http://localhost:3000/saved')
        await driver.wait(until.elementLocated(By.className('saved-workouts')))
        // workouts page
        await driver.wait(until.elementIsVisible(driver.findElement(By.className('sub-title'))))
        let titleText = await driver.findElement(By.className('title')).getText()
        let subTitleText = await driver.findElement(By.className('sub-title')).getText()

        test("Testing workouts page", _ => {
            assert.equal(titleText, "Workouts")
            assert.equal(subTitleText, "Start workouts from here without them being planned.")
        })


        await driver.get('http://localhost:3000/account')
        await driver.wait(until.elementLocated(By.className('load-anim account-details')))
        // account page

        let accountDetails = await driver.findElement(By.className('load-anim account-details'))
        await driver.wait(until.elementIsVisible(accountDetails))
        let accountDetailsElements = await accountDetails.findElements(By.tagName('p'))
        let accountDetailsText = await Promise.all(accountDetailsElements.map(async el => await el.getText()))

        test("Testing account page", _ => {
            assert.deepEqual(accountDetailsText, ['gipsz_jakab', 'gipszjakab@teszt.com', 'Anatomy:', 'Masculine'])
        })


    } finally {
       await driver.quit()
    }
  
}

async function delay(time){
    return new Promise((resolve) => {
        setTimeout(resolve, time);
      });    
}

runTests()