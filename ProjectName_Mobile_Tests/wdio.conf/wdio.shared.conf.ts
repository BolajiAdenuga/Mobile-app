import { saveScreenshot } from '../e2e/utils/screenshot.utils.js';

/**
 * Settings every platform/environment config merges on top of.
 * Platform-specific configs (android/ios) set `capabilities`.
 * Environment-specific configs (local/ci/browserstack) set `hostname`,
 * `port`, `user`/`key`, and any service-level options.
 * `capabilities` is deliberately left out here (platform configs add it) —
 * that's why this is `Partial<WebdriverIO.Config>` rather than the full type.
 */
export const sharedConfig: Partial<WebdriverIO.Config> = {
    specs: ['../e2e/tests/**/*.spec.ts'],
    logLevel: 'info',
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 2,

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000,
    },

    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: './reports/allure-results',
                disableWebdriverStepsReporting: false,
                disableWebdriverScreenshotsReporting: false,
            },
        ],
    ],

    afterTest: async function (test, _context, result) {
        if (!result.passed) {
            await saveScreenshot(`${test.parent}-${test.title}`);
        }
    },
};
