const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = 'http://localhost:5174';
const DEFAULT_TIMEOUT = 30000;

async function setupDriver() {
    const options = new chrome.Options();
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    await driver.manage().setTimeouts({ implicit: 10000 });
    await driver.manage().window().setRect({ width: 1366, height: 768 });
    
    return driver;
}

describe('Account Creation Test', () => {
    let driver;

    beforeAll(async () => {
        driver = await setupDriver();
    });

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    test('Create New Account', async () => {
        try {
            // Navigate to register page
            await driver.get(`${BASE_URL}/register`);
            
            // Wait for form elements
            const usernameInput = await driver.wait(
                until.elementLocated(By.css('input[name="username"]')),
                DEFAULT_TIMEOUT
            );
            const emailInput = await driver.wait(
                until.elementLocated(By.css('input[name="email"]')),
                DEFAULT_TIMEOUT
            );
            const passwordInput = await driver.wait(
                until.elementLocated(By.css('input[name="password"]')),
                DEFAULT_TIMEOUT
            );
            const confirmPasswordInput = await driver.wait(
                until.elementLocated(By.css('input[name="confirmPassword"]')),
                DEFAULT_TIMEOUT
            );

            // Generate unique username and email
            const timestamp = new Date().getTime();
            const username = `testuser${timestamp}`;
            const email = `testuser${timestamp}@example.com`;
            const password = 'Test@123';

            // Fill in the form
            await usernameInput.sendKeys(username);
            await emailInput.sendKeys(email);
            await passwordInput.sendKeys(password);
            await confirmPasswordInput.sendKeys(password);

            // Submit the form
            const submitButton = await driver.wait(
                until.elementLocated(By.css('button[type="submit"]')),
                DEFAULT_TIMEOUT
            );
            await submitButton.click();

            // Wait for successful registration (redirect to login)
            await driver.wait(
                until.urlIs(`${BASE_URL}/login`),
                DEFAULT_TIMEOUT,
                'Registration failed - no redirect to login page'
            );

            // Verify success message if present
            try {
                const successMessage = await driver.wait(
                    until.elementLocated(By.css('.MuiAlert-standardSuccess')),
                    5000
                );
                const messageText = await successMessage.getText();
                expect(messageText).toContain('success');
            } catch (error) {
                // Success message might not be present, that's okay if we got redirected
                console.log('No success message found, but redirect successful');
            }

        } catch (error) {
            // Take screenshot on failure
            const screenshot = await driver.takeScreenshot();
            require('fs').writeFileSync('registration-error.png', screenshot, 'base64');
            throw error;
        }
    }, 60000); // 60 second timeout for this test
});
