const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = 'http://localhost:5173'; // Vite dev server default port

async function setupDriver() {
    const options = new chrome.Options();
    // options.addArguments('--headless'); // Uncomment for headless testing

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    return driver;
}

async function waitForElement(driver, selector, timeout = 10000) {
    return await driver.wait(until.elementLocated(By.css(selector)), timeout);
}

async function clearAndType(element, text) {
    await element.clear();
    await element.sendKeys(text);
}

module.exports = {
    BASE_URL,
    setupDriver,
    waitForElement,
    clearAndType
};
