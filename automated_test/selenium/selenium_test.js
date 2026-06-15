const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const inputConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../input.json'), 'utf8'));
let baseUrl = inputConfig.webBaseUrl || 'http://localhost:8081';
if (!baseUrl.endsWith('/OmniAudit') && !baseUrl.endsWith('/OmniAudit/')) {
  baseUrl = baseUrl.replace(/\/$/, '') + '/OmniAudit';
}

async function clearReactInput(driver, element) {
  await driver.executeScript((el) => {
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeSetter.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, element);
}

async function runSeleniumTests() {
  console.log('Starting Selenium Web E2E Test Suite...');
  const options = new chrome.Options();
  options.addArguments('--headless'); // Headless browser for background execution
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  // Test Results collector
  const testResults = [];

  function recordResult(testId, name, status, timeMs, message) {
    console.log(`[${status}] ${name} (${timeMs}ms) - ${message}`);
    testResults.push({
      testId,
      name,
      status,
      timeMs,
      message,
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Test Case 1: Load Website
    let startTime = Date.now();
    await driver.get(baseUrl);
    
    // Clear localStorage to start with a clean mock database state
    await driver.executeScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem('is_selenium_test', 'true');
    });
    await driver.navigate().refresh();
    
    let duration = Date.now() - startTime;
    recordResult('TC-01', 'Load Web Application Portal', 'PASS', duration, `Successfully loaded ${baseUrl} and cleared state`);

    // Test Case 2: Validate Splash Redirection to Login
    startTime = Date.now();
    await driver.wait(until.urlContains('/login'), 8000);
    duration = Date.now() - startTime;
    const currentUrl = await driver.getCurrentUrl();
    recordResult('TC-02', 'Splash Screen Routing Validation', 'PASS', duration, `Routed to Login page correctly: ${currentUrl}`);

    // Test Case 3: Verify Login Inputs exist
    startTime = Date.now();
    const loginInputs = await driver.findElements(By.css('input'));
    duration = Date.now() - startTime;
    if (loginInputs.length >= 2) {
      recordResult('TC-03', 'Identify Input Fields', 'PASS', duration, `Found ${loginInputs.length} input field(s).`);
    } else {
      recordResult('TC-03', 'Identify Input Fields', 'FAIL', duration, `Insufficient inputs found: ${loginInputs.length}`);
    }

    // Test Case 4: Invalid Login Failure Validation
    startTime = Date.now();
    const usernameInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Username or Email']")), 5000);
    const passwordInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Enter your password']")), 5000);
    
    await usernameInput.sendKeys('WrongUser');
    await passwordInput.sendKeys('WrongPass');
    
    const loginButton = await driver.findElement(By.xpath("//*[text()='Log In'] | //div[contains(text(), 'Log In')]"));
    await loginButton.click();
    
    // Verify custom inline error banner appears
    try {
      const errorBanner = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Login Failed: Invalid username or password')]")), 5000);
      const errorText = await errorBanner.getText();
      duration = Date.now() - startTime;
      recordResult('TC-04', 'Invalid Login Credentials Alert Validation', 'PASS', duration, `Received correct failure notification: ${errorText}`);
    } catch (e) {
      duration = Date.now() - startTime;
      recordResult('TC-04', 'Invalid Login Credentials Alert Validation', 'FAIL', duration, 'No error banner was displayed for invalid credentials.');
    }

    // Test Case 5: Valid Login Success & Redirect to Main Tab Portal
    startTime = Date.now();
    const usernameInputValid = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Username or Email']")), 5000);
    const passwordInputValid = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Enter your password']")), 5000);
    const loginButtonValid = await driver.findElement(By.xpath("//*[text()='Log In'] | //div[contains(text(), 'Log In')]"));
    
    await clearReactInput(driver, usernameInputValid);
    await usernameInputValid.sendKeys('Sanjay29');

    await clearReactInput(driver, passwordInputValid);
    await passwordInputValid.sendKeys('pass123');
    await loginButtonValid.click();

    // Wait for Dashboard routing
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return url === baseUrl || url === baseUrl + '/' || !url.includes('/login');
    }, 6000);
    duration = Date.now() - startTime;
    recordResult('TC-05', 'Admin Authentication Success', 'PASS', duration, 'Authenticated successfully with Sanjay29 profile');

    // Test Case 6: Dashboard Content verification
    startTime = Date.now();
    const categoriesSection = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Select a category to scan')]")), 5000);
    duration = Date.now() - startTime;
    recordResult('TC-06', 'Dashboard View Verification', 'PASS', duration, 'Dashboard header and options rendered successfully.');

    // Test Case 7: Navigate to Rental Agreement scan screen
    startTime = Date.now();
    const rentalCard = await driver.findElement(By.xpath("//*[text()='Rental'] | //*[contains(text(), 'Rental')]"));
    await rentalCard.click();
    await driver.wait(until.urlContains('/upload'), 5000);
    duration = Date.now() - startTime;
    recordResult('TC-07', 'Navigate to Document Picker', 'PASS', duration, 'Successfully routed to upload page for Rental Agreement.');

    // Test Case 8: Mock Document Selection
    startTime = Date.now();
    
    // Intercept programmatic element creation for file pickers
    await driver.executeScript(() => {
      window._seleniumFileInput = null;
      const originalCreate = document.createElement;
      document.createElement = function(tagName) {
        const el = originalCreate.call(document, tagName);
        if (tagName.toLowerCase() === 'input') {
          const originalSetAttribute = el.setAttribute;
          el.setAttribute = function(name, value) {
            if (name === 'type' && value === 'file') {
              window._seleniumFileInput = el;
            }
            return originalSetAttribute.call(el, name, value);
          };
          Object.defineProperty(el, 'type', {
            set: function(val) {
              if (val === 'file') {
                window._seleniumFileInput = el;
              }
              originalSetAttribute.call(el, 'type', val);
            },
            get: function() {
              return el.getAttribute('type');
            }
          });
          
          const originalDispatchEvent = el.dispatchEvent;
          el.dispatchEvent = function(event) {
            if (event && event.type === 'click') {
              console.log('Bypassed file input click event to avoid headless browser dialog locks.');
              return true;
            }
            return originalDispatchEvent.call(el, event);
          };

          el.style.opacity = '0';
          el.style.position = 'absolute';
          setTimeout(() => {
            if (!el.parentNode) {
              document.body.appendChild(el);
            }
          }, 50);
        }
        return el;
      };
    });

    const uploadZone = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Tap to browse files')]")), 5000);
    await uploadZone.click();

    await driver.wait(async () => {
      return await driver.executeScript("return !!window._seleniumFileInput;");
    }, 6000);

    await driver.executeScript(() => {
      const el = window._seleniumFileInput;
      if (el) {
        el.style.display = 'block';
        el.style.opacity = '1';
        el.style.width = '100px';
        el.style.height = '100px';
        el.style.position = 'absolute';
        el.style.zIndex = '9999';
      }
    });

    const fileInput = await driver.executeScript("return window._seleniumFileInput;");
    const filePath = path.resolve(__dirname, '../../dummy.jpg');
    await fileInput.sendKeys(filePath);

    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Remove & pick again')]")), 8000);
    duration = Date.now() - startTime;
    recordResult('TC-08', 'Document Selection Integration', 'PASS', duration, 'Successfully selected mock dummy.jpg document');

    // Test Case 9: Execute Audit Scan Submission
    startTime = Date.now();
    const startScanBtn = await driver.findElement(By.xpath("//*[text()='Start Audit Scan'] | //div[contains(text(), 'Start Audit Scan')]"));
    await startScanBtn.click();

    await driver.wait(until.urlContains('/results'), 20000);
    duration = Date.now() - startTime;
    const resultsUrl = await driver.getCurrentUrl();

    const pageSource = await driver.getPageSource();
    if (pageSource.includes('Audit Failed') || pageSource.includes('Network Error')) {
      recordResult('TC-09', 'API Document Audit Execution', 'FAIL', duration, `Audit failed or blocked by CORS network restriction at URL: ${resultsUrl}`);
    } else {
      recordResult('TC-09', 'API Document Audit Execution', 'PASS', duration, `Audit completed successfully! Routed to: ${resultsUrl}`);
    }

    // Test Case 10: Session Persistence on Reload
    startTime = Date.now();
    await driver.navigate().refresh();
    await driver.sleep(1500);
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      const onValidUrl = url === baseUrl || url === baseUrl + '/' || url.includes('/results') || url.includes('/history') || url.includes('/profile');
      if (onValidUrl) {
        const dashboardHeader = await driver.findElements(By.xpath(
          "//*[contains(text(), 'Select a category to scan')] | " +
          "//*[contains(text(), 'Audit Failed')] | " +
          "//*[contains(text(), 'Go Back')] | " +
          "//*[contains(text(), 'Audit Results')]"
        ));
        return dashboardHeader.length > 0;
      }
      return false;
    }, 12000);
    duration = Date.now() - startTime;
    recordResult('TC-10', 'Session Persistence Across Reloads', 'PASS', duration, 'Successfully verified user session remains logged in after page refresh');
 
    // Test Case 11: Navigate to Profile and Log Out
    startTime = Date.now();
    await driver.get(baseUrl + '/profile');
    await driver.sleep(1500);
    const logOutBtn = await driver.wait(until.elementLocated(By.xpath("//*[text()='Log Out'] | //div[contains(text(), 'Log Out')]")), 8000);
    await driver.executeScript("arguments[0].click();", logOutBtn);
    await driver.wait(until.urlContains('/login'), 8000);
    duration = Date.now() - startTime;
    recordResult('TC-11', 'Profile Tab Navigation & Log Out', 'PASS', duration, 'Successfully navigated to profile page and signed out of session');
 
    // Test Case 12: New Account Sign Up Registration
    startTime = Date.now();
    const signUpLink = await driver.wait(until.elementLocated(By.xpath("//*[text()='Sign up'] | //div[contains(text(), 'Sign up')]")), 8000);
    await driver.executeScript("arguments[0].click();", signUpLink);
    await driver.wait(until.urlContains('/signup'), 8000);
    await driver.sleep(1000);
 
    const nameIn = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Full Name']")), 5000);
    const userIn = await driver.findElement(By.xpath("//input[@placeholder='Username']"));
    const emailIn = await driver.findElement(By.xpath("//input[@placeholder='Email Address']"));
    const phoneIn = await driver.findElement(By.xpath("//input[@placeholder='Phone Number']"));
    const passIn = await driver.findElement(By.xpath("//input[@placeholder='Create Password']"));
 
    await nameIn.sendKeys('Selenium User');
    await userIn.sendKeys('selenium_tester');
    await emailIn.sendKeys('selenium@test.com');
    await phoneIn.sendKeys('9876543210');
    await passIn.sendKeys('testPass123!');
 
    const signUpSubmit = await driver.findElement(By.xpath("//*[text()='Sign Up'] | //div[contains(text(), 'Sign Up')]"));
    await driver.executeScript("arguments[0].click();", signUpSubmit);
 
    // Verify redirected to dashboard tabs
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      const onValidUrl = url === baseUrl || url === baseUrl + '/' || url.includes('/history') || url.includes('/profile');
      if (onValidUrl) {
        const dashboardHeader = await driver.findElements(By.xpath("//*[contains(text(), 'Select a category to scan')]"));
        return dashboardHeader.length > 0;
      }
      return false;
    }, 12000);
    duration = Date.now() - startTime;
    recordResult('TC-12', 'Custom Registration & Account Verification', 'PASS', duration, 'Successfully registered new user selenium_tester and logged in');
 
    // Test Case 13: New Account Persistence Validation
    startTime = Date.now();
    await driver.navigate().refresh();
    await driver.sleep(1500);
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      const onValidUrl = url === baseUrl || url === baseUrl + '/' || url.includes('/history') || url.includes('/profile') || url.includes('/upload');
      if (onValidUrl) {
        const dashboardHeader = await driver.findElements(By.xpath("//*[contains(text(), 'Select a category to scan')]"));
        return dashboardHeader.length > 0;
      }
      return false;
    }, 12000);
    duration = Date.now() - startTime;
    recordResult('TC-13', 'New Registered Account Reload Persistence', 'PASS', duration, 'Session persists for dynamically registered custom accounts');
 
    // Test Case 14: Log Out and Google Auth SSO Login
    startTime = Date.now();
    await driver.get(baseUrl + '/profile');
    await driver.sleep(1500);
    const logOutBtn2 = await driver.wait(until.elementLocated(By.xpath("//*[text()='Log Out'] | //div[contains(text(), 'Log Out')]")), 8000);
    await driver.executeScript("arguments[0].click();", logOutBtn2);
    await driver.wait(until.urlContains('/login'), 8000);
    await driver.sleep(1000);
 
    // Click Google Auth SSO Button
    const googleBtn = await driver.wait(until.elementLocated(By.xpath("//*[text()='Continue with Google'] | //div[contains(text(), 'Continue with Google')]")), 8000);
    
    const originalWindow = await driver.getWindowHandle();
    await driver.executeScript("arguments[0].click();", googleBtn);
 
    // Wait for the popup window to open
    await driver.wait(async () => {
      const handles = await driver.getAllWindowHandles();
      return handles.length > 1;
    }, 10000);
 
    // Switch to popup window
    const allHandles = await driver.getAllWindowHandles();
    const popupHandle = allHandles.find(h => h !== originalWindow);
    await driver.switchTo().window(popupHandle);
 
    // Select Sanjay Vignesh account in popup chooser
    const accountCard = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Sanjay Vignesh')]")), 8000);
    await driver.executeScript("arguments[0].click();", accountCard);
 
    // Switch back to parent window
    await driver.switchTo().window(originalWindow);
 
    // Verify redirected to dashboard tabs
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      const onValidUrl = url === baseUrl || url === baseUrl + '/' || url.includes('/history') || url.includes('/profile');
      if (onValidUrl) {
        const dashboardHeader = await driver.findElements(By.xpath("//*[contains(text(), 'Select a category to scan')]"));
        return dashboardHeader.length > 0;
      }
      return false;
    }, 12000);
    duration = Date.now() - startTime;
    recordResult('TC-14', 'Google Single Sign-On Authentication', 'PASS', duration, 'Successfully logged in dynamically via Google SSO with mail prefix profile');
 
    // Test Case 15: Google SSO Session Persistence Validation
    startTime = Date.now();
    await driver.navigate().refresh();
    await driver.sleep(1500);
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      const onValidUrl = url === baseUrl || url === baseUrl + '/' || url.includes('/history') || url.includes('/profile') || url.includes('/upload');
      if (onValidUrl) {
        const dashboardHeader = await driver.findElements(By.xpath("//*[contains(text(), 'Select a category to scan')]"));
        return dashboardHeader.length > 0;
      }
      return false;
    }, 12000);
    duration = Date.now() - startTime;
    recordResult('TC-15', 'Google SSO Session Reload Persistence', 'PASS', duration, 'Google SSO authenticated session successfully persists across browser reloads');

  } catch (error) {
    console.error('An error occurred during test execution:', error);
    try {
      const currentUrl = await driver.getCurrentUrl();
      console.log(`Failure URL: ${currentUrl}`);
      const pageSrc = await driver.getPageSource();
      console.log('Page Source snippet (2000 chars):');
      console.log(pageSrc.substring(0, 2000));
      
      // Look for any input fields on the screen
      const inputs = await driver.findElements(By.css('input'));
      console.log(`Inputs count on screen: ${inputs.length}`);
      for (let i = 0; i < inputs.length; i++) {
        const placeholder = await inputs[i].getAttribute('placeholder');
        const value = await inputs[i].getAttribute('value');
        console.log(`Input ${i}: placeholder="${placeholder}", value="${value}"`);
      }
    } catch (e) {
      console.log('Could not retrieve diagnostics:', e.message);
    }
    try {
      const logs = await driver.manage().logs().get('browser');
      console.log('Browser Console Logs:');
      logs.forEach(log => console.log(`[${log.level.name}] ${log.message}`));
    } catch (e) {
      console.log('Could not retrieve browser logs:', e.message);
    }
    recordResult('TC-ERR', 'Unexpected Execution Failure', 'FAIL', 0, error.message);
  } finally {
    await driver.quit();
    await generateExcelReport(testResults);
  }
}

async function generateExcelReport(results) {
  console.log('Generating Excel report...');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('E2E Web Test Summary');

  // Columns layout
  worksheet.columns = [
    { header: 'Test ID', key: 'testId', width: 12 },
    { header: 'Test Scenario Name', key: 'name', width: 35 },
    { header: 'Result Status', key: 'status', width: 12 },
    { header: 'Response Time (ms)', key: 'timeMs', width: 20 },
    { header: 'Details / Verdict Logs', key: 'message', width: 60 },
    { header: 'Execution Timestamp', key: 'timestamp', width: 25 }
  ];

  // Apply styling
  worksheet.getRow(1).font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '2F3542' }
  };

  results.forEach(res => {
    const row = worksheet.addRow(res);
    const statusCell = row.getCell('status');
    if (res.status === 'PASS') {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2ED573' }
      };
      statusCell.font = { bold: true, color: { argb: 'FFFFFF' } };
    } else {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4757' }
      };
      statusCell.font = { bold: true, color: { argb: 'FFFFFF' } };
    }
  });

  const reportPath = path.join(__dirname, '../selenium_report.xlsx');
  try {
    await workbook.xlsx.writeFile(reportPath);
    console.log(`Excel report successfully written to: ${reportPath}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      const backupPath = path.join(__dirname, `../selenium_report_backup.xlsx`);
      await workbook.xlsx.writeFile(backupPath);
      console.warn(`[WARNING] Excel file is locked/open. Saved report to backup path: ${backupPath}`);
    } else {
      throw err;
    }
  }
}

if (require.main === module) {
  runSeleniumTests();
}
