# Umami Mobile Automation

Cross-platform mobile automation framework for Android and iOS using **WebdriverIO**, **Appium**, **Cucumber**, and **Allure** reporting.

## Features

✅ **Android USB Testing** - Local device automation via Appium UiAutomator2  
✅ **iOS USB Testing** - Local device automation via Appium XCUITest  
✅ **BDD with Cucumber** - Behavior-driven testing with feature files  
✅ **Video Recording** - Automatic test recording using scrcpy  
✅ **Allure Reporting** - Beautiful, interactive test reports  
✅ **Screenshot on Failure** - Automatic screenshot capture for failed steps  
✅ **Cross-Platform** - Single test suite for Android & iOS  

## Prerequisites

- **Node.js** 18+ and npm
- **Java JDK** 11+ (for Appium)
- **Android SDK** with platform-tools
- **Xcode** (for iOS testing)
- **Appium** 3.x (`npm install -g appium`)
- **scrcpy** (for video recording)
- **XCUITest driver** for iOS (`npx appium driver install xcuitest`)

## Setup

### iPhone 15 Pro Max USB setup (required for iOS automation)

> Important: local iOS automation with Appium/XCUITest requires a Mac computer. Windows cannot run XCUITest locally against an iPhone.

If you want to connect your iPhone 15 Pro Max for USB automation, follow these steps on the Mac that will run Appium:

1. Install Xcode from the App Store and open it once to accept the license.
2. Install the Xcode command line tools:
   ```bash
   xcode-select --install
   ```
3. On the iPhone, enable Developer Mode:
   - Settings > Privacy & Security > Developer Mode
   - Turn it on and restart the phone
4. Connect the iPhone to the Mac with a cable.
5. When prompted on the phone, tap Trust This Computer.
6. If the phone is not showing up to Xcode/Appium, open Xcode and go to Window > Devices and Simulators to confirm it is recognized.
7. Make sure the device is listed by Xcode:
   ```bash
   xcrun xctrace list devices
   ```
8. Install Appium and the iOS driver on the Mac:
   ```bash
   npm install -g appium
   npx appium driver install xcuitest
   ```
9. If you plan to install an app manually, use a signed `.app` or `.ipa` bundle that is compatible with your device.
10. Fill the values in `.env`:
   ```env
   IOS_DEVICE_UDID=your_device_udid_here
   IOS_APP_PATH=/path/to/your/app.app
   ```

If you are still on Windows, the practical option is to use a Mac or a cloud service such as BrowserStack for real iPhone execution.

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# Android USB Device
ANDROID_DEVICE_UDID=your_device_udid_here

# iOS USB Device
IOS_DEVICE_UDID=your_device_udid_here

# App Paths
ANDROID_APP_PATH=./apps/android/umami-android-staging.apk
IOS_APP_PATH=./apps/ios/umami-ios-staging.ipa

# Test Credentials
TEST_USER_EMAIL=your_email@example.com
TEST_USER_PASSWORD=your_password

# Negative Test Data
INVALID_EMAIL=invalid@test.com
INCORRECT_PASSWORD=wrongpassword
```

### 3. Get Your Device UDID

**Android:**
```powershell
adb devices
```

**iOS:**
```bash
instruments -s devices
```

## Running Tests

### Android USB Tests

```bash
# Run all Android tests
npm run test:android:all

# Run specific test
npm run test:android:auth:blank

# Run with specific tags
npm run test:smoke:android
npm run test:regression:android

# Run with video recording
npm run test:android:auth:blank:video
```

### iOS USB Tests

```bash
# Run all iOS tests
npm run test:ios:all

# Run specific test
npm run test:ios:auth:blank
```

### Generate Reports

```bash
# Generate Allure report
npm run report:generate

# Open Allure report
npm run report:open

# Serve Allure report
npm run report:serve
```

## Video Recording

Tests can be automatically recorded using **scrcpy**:

```bash
# Record a specific test
npm run test:android:auth:blank:video

# Record all tests
npm run test:android:all:video

# Custom recording with PowerShell
pwsh -Command "& .\run-test-with-video.ps1 -SpecFile './test/features/authentication/blank-fields-validation.feature'"
```

Videos are saved in: `./videos/`

## Project Structure

```
Android/
├── config/
│   ├── mobile-config.ts           # Configuration loader
│   ├── wdio.android.local.conf.ts # Android emulator config
│   ├── wdio.android.usb.conf.ts   # Android USB device config
│   ├── wdio.ios.usb.conf.ts       # iOS USB device config
│   └── browserstack.config.json   # BrowserStack credentials
├── test/
│   ├── features/                  # Cucumber feature files
│   │   ├── authentication/
│   │   ├── forgot-password/
│   │   └── sign-up/
│   ├── step-definitions/          # Cucumber step implementations
│   ├── pageobjects/               # Page Object Model classes
│   ├── locators/                  # UI element locators (Android/iOS)
│   ├── helpers/                   # Utility functions
│   └── data/                      # Test data
├── apps/
│   ├── android/                   # Android APK files
│   └── ios/                       # iOS IPA files
├── reports/
│   ├── allure-results/            # Test execution results
│   └── allure-report/             # Generated HTML report
├── logs/                          # WebdriverIO logs
├── screenshots/                   # Failed step screenshots
├── videos/                        # Test recordings
├── run-test-with-video.ps1        # Test execution with recording script
├── package.json                   # Dependencies and npm scripts
├── wdio.conf.ts                   # Main WebdriverIO config
└── README.md                      # This file
```

## Test Structure (BDD)

Tests are written using **Gherkin syntax** (feature files):

```gherkin
Feature: Mobile Sign In - Blank Fields Validation
  Scenario: Validation for blank Email and Password fields
    Given the user is on the Sign In screen
    When the user taps the Sign In button without entering credentials
    Then the Email Address field should display the required validation message
    And the Password field should display the required validation message
```

Step implementations are in `test/step-definitions/` using **WebdriverIO** and **Appium**.

## Locators

Locators are organized by platform:

- **Android:** `test/locators/android/`
- **iOS:** `test/locators/ios/`

Get locators using:
- **Appium Inspector** (GUI tool)
- **uiautomatorviewer** (Android)
- **Xcode UI Inspector** (iOS)

## Debugging

### Appium Inspector

Launch Appium Inspector to interact with your device and find locators:

```bash
appium-inspector
```

### Enable Debug Logs

Edit `wdio.android.usb.conf.ts`:

```typescript
logLevel: 'debug', // Change from 'info' to 'debug'
```

### Device USB Debugging

**Android:**
```powershell
adb shell dumpsys activity
adb logcat | grep umami
```

**iOS:**
```bash
ideviceSyslog
```

## Git Workflow

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
git add .
git commit -m "feat: your feature description"

# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

## CI/CD

Tests run automatically on GitHub Actions. Check `.github/workflows/appium-test.yml` for the pipeline configuration.

### GitHub Actions secrets

Add these secrets in your repository settings under Settings > Secrets and variables > Actions:

- `ANDROID_DEVICE_UDID`
- `IOS_DEVICE_UDID`
- `ANDROID_APP_PATH`
- `IOS_APP_PATH`
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`
- `INVALID_EMAIL`
- `INCORRECT_PASSWORD`
- `BROWSERSTACK_USERNAME` (optional, for remote mobile execution)
- `BROWSERSTACK_ACCESS_KEY` (optional, for remote mobile execution)

The workflow runs the TypeScript validation on every push/PR. The optional mobile smoke job is enabled only when BrowserStack credentials are provided.

## Troubleshooting

### "Device not found" Error

```powershell
# Restart ADB daemon
adb kill-server
adb start-server
adb devices
```

### Appium Connection Failed

```bash
# Check if Appium is running
appium --version

# Start Appium locally
appium --address 127.0.0.1 --port 4723
```

### Permission Issues on iOS

```bash
# Install WebDriverAgent
xcode-select --install
sudo xcode-select --reset
```

## Resources

- **WebdriverIO:** https://webdriver.io/docs/cucumber/
- **Appium:** https://appium.io/docs/en/latest/
- **Cucumber:** https://cucumber.io/docs/gherkin/
- **Allure:** https://docs.qameta.io/allure/
- **scrcpy:** https://github.com/Genymobile/scrcpy

## License

This project is part of the Tepia Automation Suite.

---

**Last Updated:** 2026-08-06  
**Maintainer:** Automation Team (automation@tepia.co)
