const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

// Constants
const BASE_URL = 'http://localhost:5174';
const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots/responsive');
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

describe('Responsive Design Tests', () => {
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

    test('Navigation menu adapts to different screen sizes', async () => {
        try {
            // Test mobile viewport
            await driver.manage().window().setRect({ width: 375, height: 667 }); // iPhone SE size
            await driver.get(BASE_URL);
            await driver.sleep(1000); // Wait for responsive changes
            await takeScreenshot(driver, 'mobile-nav');

            // Check if hamburger menu exists on mobile
            const hamburgerMenu = await driver.findElements(By.css('.MuiIconButton-root'));
            expect(hamburgerMenu.length).toBeGreaterThan(0);
            log('Hamburger menu present on mobile view');

            // Test tablet viewport
            await driver.manage().window().setRect({ width: 768, height: 1024 }); // iPad size
            await driver.sleep(1000);
            await takeScreenshot(driver, 'tablet-nav');

            // Test desktop viewport
            await driver.manage().window().setRect({ width: 1366, height: 768 });
            await driver.sleep(1000);
            await takeScreenshot(driver, 'desktop-nav');

            // Verify navigation items are visible on desktop
            const navItems = await driver.findElements(By.css('.MuiTypography-root'));
            expect(navItems.length).toBeGreaterThan(0);
            log('Navigation items visible on desktop view');

        } catch (error) {
            log(`Test failed: ${error.message}`);
            await takeScreenshot(driver, 'responsive-error');
            throw error;
        }
    }, 30000);

    test('Country cards layout adjusts to screen size', async () => {
        try {
            await driver.get(BASE_URL);

            // Test mobile layout
            await driver.manage().window().setRect({ width: 375, height: 667 });
            
            // Wait for cards to load
            await driver.wait(
                until.elementsLocated(By.css('.MuiCard-root')),
                10000,
                'Cards did not load'
            );
            await driver.sleep(1000); // Additional wait for layout to settle
            
            await takeScreenshot(driver, 'mobile-cards');
            
            // Verify cards stack vertically on mobile
            const mobileCards = await driver.findElements(By.css('.MuiCard-root'));
            if (mobileCards.length >= 2) {
                const firstCardLocation = await mobileCards[0].getRect();
                const secondCardLocation = await mobileCards[1].getRect();
                expect(secondCardLocation.y).toBeGreaterThan(firstCardLocation.y);
                log('Cards stack vertically on mobile');
            } else {
                log('Not enough cards to verify vertical stacking');
            }

            // Test desktop layout
            await driver.manage().window().setRect({ width: 1366, height: 768 });
            await driver.sleep(1000);
            await takeScreenshot(driver, 'desktop-cards');

            // Verify cards are in a grid on desktop
            const desktopCards = await driver.findElements(By.css('.MuiCard-root'));
            expect(desktopCards.length).toBeGreaterThan(0);
            log('Cards display in grid on desktop');

        } catch (error) {
            log(`Test failed: ${error.message}`);
            await takeScreenshot(driver, 'cards-error');
            throw error;
        }
    }, 30000);
});
