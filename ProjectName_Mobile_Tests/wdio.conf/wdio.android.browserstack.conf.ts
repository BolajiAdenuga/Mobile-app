import { sharedConfig } from './wdio.shared.conf.js';
import { env, requireEnv } from '../e2e/utils/env.utils.js';

/**
 * Runs on BrowserStack App Automate real devices.
 *
 * Our plan has a LIMITED time allocation — only run this deliberately
 * (release regression, cross-device coverage), never as the default
 * everyday/CI suite. Use wdio.android.local.conf.ts or
 * wdio.android.ci.conf.ts for that instead.
 *
 * Before running: upload the build once with
 *   npm run upload:browserstack:android
 * and put the resulting bs://... id in BROWSERSTACK_ANDROID_APP_ID.
 */
export const config: WebdriverIO.Config = {
    ...sharedConfig,

    user: requireEnv('BROWSERSTACK_USERNAME'),
    key: requireEnv('BROWSERSTACK_ACCESS_KEY'),
    hostname: 'hub-cloud.browserstack.com',

    services: ['browserstack'],

    capabilities: [
        {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:app': requireEnv('BROWSERSTACK_ANDROID_APP_ID'),
            'appium:deviceName': env.browserstack.androidDeviceName,
            'appium:platformVersion': env.browserstack.androidOsVersion,
            'bstack:options': {
                projectName: 'Mobile Automation - ProjectName',
                buildName: `android-${process.env.BUILD_NUMBER ?? 'local'}`,
                sessionName: 'Android regression suite',
                debug: true,
                networkLogs: true,
                appiumVersion: '2.0.1',
            },
        },
    ],
};
