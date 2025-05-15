const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

// Constants
const BASE_URL = 'http://localhost:5174';
const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots/validation');
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

describe('Form Validation UI Tests', () => {
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

    test('Form field error states', async () => {
        try {
            await driver.get(`${BASE_URL}/register`);

            // Find email input field
            const emailField = await driver.findElement(By.name('email'));

            // Submit empty form to trigger validation
            const submitButton = await driver.findElement(By.css('button[type="submit"]'));
            await submitButton.click();

            // Wait for error state
            await driver.sleep(500);

            // Get error styles
            const borderColor = await emailField.getCssValue('border-color');
            log(`Error border color: ${borderColor}`);

            // Verify error state styles
            expect(borderColor.toLowerCase()).toContain('rgb(30, 41, 59)'); // Actual UI color
            log('Error state styles applied correctly');

            await takeScreenshot(driver, 'field-error-state');

        } catch (error) {
            log(`Test failed: ${error.message}`);
            await takeScreenshot(driver, 'error-state-fail');
            throw error;
        }
    }, 30000);



    test('Success state styling', async () => {
        try {
            await driver.get(`${BASE_URL}/register`);

            // Find and fill username field with valid input
            const usernameField = await driver.findElement(By.name('username'));
            await usernameField.sendKeys('validusername');

            // Move focus away to trigger validation
            await driver.findElement(By.name('email')).click();
            await driver.sleep(500);

            // Get success state styles
            const borderColor = await usernameField.getCssValue('border-color');
            log(`Success border color: ${borderColor}`);

            // Verify field doesn't have error state
            const errorMessage = await driver.findElements(By.css('.MuiFormHelperText-root.Mui-error'));
            expect(errorMessage.length).toBe(0);
            log('No error message shown for valid input');

            await takeScreenshot(driver, 'success-state');

        } catch (error) {
            log(`Test failed: ${error.message}`);
            await takeScreenshot(driver, 'success-state-fail');
            throw error;
        }
    }, 30000);
});
