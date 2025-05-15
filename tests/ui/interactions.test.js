const { Builder, By, until, Actions } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

// Constants
const BASE_URL = 'http://localhost:5174';
const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots/interactions');
const LOG_FILE = path.join(__dirname, '../test.log');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Helper functions
function log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(LOG_FILE, logEntry);
    console.log(logEntry.trim());
}

async function takeScreenshot(driver, name) {
    try {
        const screenshot = await driver.takeScreenshot();
        const filename = path.join(SCREENSHOTS_DIR, `${name}-${Date.now()}.png`);
        fs.writeFileSync(filename, screenshot, 'base64');
        log(`Screenshot saved: ${filename}`);
    } catch (error) {
        log(`Failed to take screenshot: ${error.message}`);
    }
}

describe('UI Interaction Tests', () => {
    let driver;

    beforeEach(async () => {
        const options = new chrome.Options();
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        log('WebDriver initialized');
    });

    afterEach(async () => {
        if (driver) {
            await driver.quit();
            log('WebDriver session closed');
        }
    });

    test('Button hover states and interactions', async () => {
        try {
            await driver.get(`${BASE_URL}/login`);
            
            // Find the login button
            const loginButton = await driver.findElement(By.css('button[type="submit"]'));
            
            // Get initial button state
            const initialColor = await loginButton.getCssValue('background-color');
            log(`Initial button color: ${initialColor}`);

            // Hover over the button
            const actions = driver.actions({ bridge: true });
            await actions.move({ origin: loginButton }).perform();
            await driver.sleep(1000); // Wait for hover effect

            // Get hover state color
            const hoverColor = await loginButton.getCssValue('background-color');
            log(`Hover button color: ${hoverColor}`);

            // Verify color change on hover
            expect(hoverColor).not.toBe(initialColor);
            log('Button color changes on hover');

            await takeScreenshot(driver, 'button-hover');

        } catch (error) {
            log(`Test failed: ${error.message}`);
            await takeScreenshot(driver, 'button-error');
            throw error;
        }
    }, 30000);

    test('Form field focus states', async () => {
        try {
            await driver.get(`${BASE_URL}/login`);

            // Find email input field
            const emailField = await driver.findElement(By.name('email'));

            // Get initial border style
            const initialBorder = await emailField.getCssValue('border');
            log(`Initial border style: ${initialBorder}`);

            // Focus the field
            await emailField.click();
            await driver.sleep(500); // Wait for focus effect

            // Get focused border style
            const focusedBorder = await emailField.getCssValue('border');
            log(`Focused border style: ${focusedBorder}`);

            // Verify border style changes on focus
            expect(focusedBorder).not.toBe(initialBorder);
            log('Input field border changes on focus');

            await takeScreenshot(driver, 'input-focus');

        } catch (error) {
            log(`Test failed: ${error.message}`);
            await takeScreenshot(driver, 'focus-error');
            throw error;
        }
    }, 30000);


});
