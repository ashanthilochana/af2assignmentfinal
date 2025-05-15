const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

// Constants
const BASE_URL = 'http://localhost:5174';
const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');
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

describe('User Registration Functionality', () => {
    let driver;

    beforeAll(async () => {
        const options = new chrome.Options();
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        // options.addArguments('--headless'); // Uncomment for headless testing

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.manage().setTimeouts({ implicit: 10000 });
        await driver.manage().window().setRect({ width: 1366, height: 768 });
        log('WebDriver initialized');
    });

    afterEach(async () => {
        if (driver) {
            await driver.quit();
            log('WebDriver session closed');
        }
    });

    test('Register with invalid data', async () => {
        try {
            await driver.get(`${BASE_URL}/register`);
            log('Testing invalid registration data');

            // Test invalid email format
            log('Testing invalid email format...');
            const invalidData = {
                username: 'testuser',
                email: 'invalidemail',
                password: 'Test@123456',
                confirmPassword: 'Test@123456'
            };

            // Wait for and fill form fields
            const usernameInput = await driver.wait(
                until.elementLocated(By.name('username')),
                5000
            );
            await usernameInput.sendKeys(invalidData.username);

            const emailInput = await driver.wait(
                until.elementLocated(By.name('email')),
                5000
            );
            await emailInput.sendKeys(invalidData.email);

            const passwordInput = await driver.wait(
                until.elementLocated(By.name('password')),
                5000
            );
            await passwordInput.sendKeys(invalidData.password);

            const confirmPasswordInput = await driver.wait(
                until.elementLocated(By.name('confirmPassword')),
                5000
            );
            await confirmPasswordInput.sendKeys(invalidData.confirmPassword);

            await takeScreenshot(driver, 'register-invalid-data');

            const submitButton = await driver.findElement(By.css('button[type="submit"]'));
            await submitButton.click();

            // Wait for validation error
            const emailField = await driver.wait(
                until.elementLocated(By.name('email')),
                5000
            );
            const errorText = await emailField.getAttribute('validationMessage');
            expect(errorText.toLowerCase()).toContain('valid');
            log(`Found validation error: ${errorText}`);

            // Should stay on register page
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toContain('/register');
            log('Still on register page as expected');
            
            // Should see validation error
            const validationMessage = await emailField.getAttribute('validationMessage');
            expect(validationMessage.toLowerCase()).toContain('valid');
            log('Invalid data validation successful');
            await takeScreenshot(driver, 'register-validation-errors');

        } catch (error) {
            log(`Test failed: ${error.message}`);
            await takeScreenshot(driver, 'register-error');
            throw error;
        }
    }, 30000); // 30 second timeout
});
