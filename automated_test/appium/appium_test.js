const { remote } = require('webdriverio');
const fs = require('fs');
const path = require('path');

const inputConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../input.json'), 'utf8'));
const appPath = path.resolve(__dirname, '..', inputConfig.mobileAppPath || './builds/app-release.apk');

// Appium capabilities for WebdriverIO
const wdOpts = {
  hostname: '127.0.0.1',
  port: 4723,
  path: '/wd/hub',
  capabilities: {
    platformName: 'Android',
    'appium:deviceName': 'Android Emulator',
    'appium:automationName': 'UiAutomator2',
    'appium:app': appPath,
    'appium:ensureWebviewsHavePages': true,
    'appium:nativeWebScreenshot': true,
    'appium:newCommandTimeout': 3600,
    'appium:connectHardwareKeyboard': true
  }
};

async function runAppiumTests() {
  console.log('Initializing Appium Session for Android Native E2E Verification...');
  console.log(`Target APK file path: ${appPath}`);

  if (!fs.existsSync(appPath)) {
    console.warn(`[WARNING] Target APK file not found at: ${appPath}`);
    console.warn('Ensure the app is built and placed at the designated path before running real-world Appium tests.');
  }

  let driver;
  try {
    driver = await remote(wdOpts);
    console.log('Appium session created successfully.');

    // 1. Wait for splash screen redirection
    console.log('Waiting for application to load and route to Login Screen...');
    await driver.pause(4000);

    // 2. Perform Login Flow
    console.log('Interacting with login inputs...');
    const usernameInput = await driver.$('//android.widget.EditText[@text="Username or Email"]');
    await usernameInput.setValue('Sanjay29');

    const passwordInput = await driver.$('//android.widget.EditText[@text="Enter your password"]');
    await passwordInput.setValue('pass123');

    const loginBtn = await driver.$('//android.view.ViewGroup[@content-desc="Log In"]');
    await loginBtn.click();
    console.log('Login button tapped.');

    // 3. Verify Dashboard Loads
    await driver.pause(3000);
    const dashboardTitle = await driver.$('//android.widget.TextView[@text="OmniAudit"]');
    const isVisible = await dashboardTitle.isDisplayed();
    
    if (isVisible) {
      console.log('[PASS] Dashboard Screen verified.');
    } else {
      console.log('[FAIL] Could not verify Dashboard Screen rendering.');
    }

    // 4. Select Document Category
    console.log('Selecting document category: Rental...');
    const rentalCard = await driver.$('//android.widget.TextView[@text="Rental"]');
    await rentalCard.click();

    // 5. Navigate to Upload Verification
    await driver.pause(2000);
    const uploadHeader = await driver.$('//android.widget.TextView[@text="RENTAL AGREEMENT"]');
    if (await uploadHeader.isDisplayed()) {
      console.log('[PASS] Document Upload screen routed correctly.');
    } else {
      console.log('[FAIL] Could not reach Upload screen.');
    }

  } catch (error) {
    console.error('[Appium Error]: Execution failed:', error.message);
  } finally {
    if (driver) {
      await driver.deleteSession();
      console.log('Appium session terminated.');
    }
  }
}

if (require.main === module) {
  runAppiumTests();
}
