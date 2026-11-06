import { sharedConfig } from './wdio.shared.conf.js';
import { env, requireEnv } from '../e2e/utils/env.utils.js';

/**
 * Runs on BrowserStack App Automate real devices.
 *
 * Our plan has a LIMITED time allocation — only run this deliberately
 * (release regression, cross-device coverage), never as the default
 * everyday/CI suite. Use wdio.ios.local.conf.ts or wdio.ios.ci.conf.ts
 * for that instead.
 *
 * Before running: upload the build once with
 *   npm run upload:browserstack:ios
 * and put the resulting bs://... id in BROWSERSTACK_IOS_APP_ID.
 * This can be the actual TestFlight release build's .ipa — BrowserStack
 * needs its own uploaded copy, it cannot pull a build from TestFlight itself.
 */
export const config: WebdriverIO.Config = {
    ...sharedConfig,

    user: requireEnv('BROWSERSTACK_USERNAME'),
    key: requireEnv('BROWSERSTACK_ACCESS_KEY'),
    hostname: 'hub-cloud.browserstack.com',

    services: ['browserstack'],

    capabilities: [
        {
            platformName: 'iOS',
            'appium:automationName': 'XCUITest',
            'appium:app': requireEnv('BROWSERSTACK_IOS_APP_ID'),
            'appium:deviceName': env.browserstack.iosDeviceName,
            'appium:platformVersion': env.browserstack.iosOsVersion,
            'bstack:options': {
                projectName: 'Mobile Automation - ProjectName',
                buildName: `ios-${process.env.BUILD_NUMBER ?? 'local'}`,
                sessionName: 'iOS regression suite',
                debug: true,
                networkLogs: true,
            },
        },
    ],
};
