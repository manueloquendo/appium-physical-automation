import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { browser } from '@wdio/globals';

import { mobileConfig } from './mobile-config.js';

const configFilePath = fileURLToPath(import.meta.url);
const configDirectory = path.dirname(configFilePath);
const projectRoot = path.resolve(configDirectory, '..');

const featurePath = path.join(projectRoot, 'test', 'features', '**', '*.feature');
const stepDefinitionsPath = path.join(projectRoot, 'test', 'step-definitions', '**', '*.ts');
const logsDirectory = path.join(projectRoot, 'logs');
const screenshotsDirectory = path.join(projectRoot, 'screenshots');
const allureResultsDirectory = path.join(projectRoot, 'reports', 'allure-results');

const iosDeviceUdid = mobileConfig.iosDeviceUdid;
const iosAppPath = mobileConfig.iosAppPath;

function validateUsbConfiguration(): void {
    const missingValues: string[] = [];

    if (!iosDeviceUdid) {
        missingValues.push('IOS_DEVICE_UDID');
    }

    if (!iosAppPath) {
        missingValues.push('IOS_APP_PATH');
    }

    if (missingValues.length > 0) {
        throw new Error(
            [
                'Missing required USB/Appium values:',
                missingValues.join(', '),
            ].join(' ')
        );
    }
}

function createExecutionDirectories(): void {
    const directories = [logsDirectory, screenshotsDirectory, allureResultsDirectory];

    for (const directory of directories) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

function sanitizeFileName(value: string): string {
    return value
        .trim()
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();
}

export const config: WebdriverIO.Config = {
    runner: 'local',
    hostname: '127.0.0.1',
    port: 4723,

    specs: [featurePath],
    exclude: [],
    maxInstances: 1,

    services: ['appium'],

    capabilities: [
        {
            platformName: 'iOS',
            'appium:udid': iosDeviceUdid,
            'appium:automationName': 'XCUITest',
            'appium:deviceName': 'iPhone Device',
            'appium:app': iosAppPath,
            'appium:noReset': false,
            'appium:newCommandTimeout': 120,
            'appium:autoAcceptAlerts': true,
        },
    ],

    logLevel: 'info',
    outputDir: logsDirectory,
    bail: 0,
    waitforTimeout: 20_000,
    connectionRetryTimeout: 180_000,
    connectionRetryCount: 3,

    framework: 'cucumber',

    cucumberOpts: {
        import: [stepDefinitionsPath],
        tagExpression: '',
        timeout: 120_000,
        failFast: false,
        snippets: true,
        source: true,
        ignoreUndefinedDefinitions: false,
    },

    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: allureResultsDirectory,
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false,
                useCucumberStepReporter: true,
                addConsoleLogs: true,
            },
        ],
    ],

    onPrepare(): void {
        validateUsbConfiguration();
        createExecutionDirectories();

        console.log('Starting Umami iOS USB/Appium execution');
        console.log(`Feature path: ${featurePath}`);
        console.log(`Step definitions path: ${stepDefinitionsPath}`);
        console.log(`Device UDID: ${iosDeviceUdid}`);
        console.log(`App path: ${iosAppPath}`);
    },

    beforeScenario(_world, context): void {
        const scenarioName = (context as any).pickle?.name ?? 'Unknown scenario';
        console.log(`Starting scenario: ${scenarioName}`);
    },

    async afterStep(step, scenario, result): Promise<void> {
        if (result.passed === true) {
            return;
        }

        const scenarioName = (scenario as any).pickle?.name ?? 'Unknown scenario';
        const stepName = (step as any).pickleStep?.text ?? 'Unknown step';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

        const screenshotFileName = ['ios', sanitizeFileName(scenarioName), sanitizeFileName(stepName), timestamp].join('_');
        const screenshotPath = path.join(screenshotsDirectory, `${screenshotFileName}.png`);

        try {
            await browser.saveScreenshot(screenshotPath);
            console.error(`Failed-step screenshot: ${screenshotPath}`);
        } catch (error) {
            console.error('The failed-step screenshot could not be captured.', error);
        }
    },

    /**
     * Runs after each Cucumber scenario.
     */
    afterScenario(
        _world,
        result
    ): void {
        if (result.passed === true) {
            console.log(
                'Cucumber scenario completed successfully'
            );

            return;
        }

        console.error(
            'Cucumber scenario failed'
        );
    },

    /**
     * Runs when all workers finish.
     */
    onComplete(
        exitCode
    ): void {
        if (exitCode === 0) {
            console.log(
                'Umami iOS USB/Appium execution completed successfully'
            );

            return;
        }

        console.error(
            'Umami iOS USB/Appium execution finished ' +
            `with exit code ${exitCode}`
        );
    },
};