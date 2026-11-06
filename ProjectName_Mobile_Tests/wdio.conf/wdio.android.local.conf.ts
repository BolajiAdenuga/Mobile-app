import { sharedConfig } from './wdio.shared.conf.js';
import { env } from '../e2e/utils/env.utils.js';
import { androidAppCapabilities } from '../e2e/utils/app.utils.js';

/**
 * Runs against a local Android emulator started by Android Studio / avdmanager.
 * Use this for everyday development — it never touches the BrowserStack quota.
 */
export const config: WebdriverIO.Config = {
    ...sharedConfig,

    hostname: env.appium.host,
    port: env.appium.port,

    services: [
        [
            'appium',
            {
                command: 'appium',
            },
        ],
    ],

    capabilities: [
        {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:deviceName': env.android.deviceName,
            'appium:platformVersion': env.android.platformVersion,
            'appium:newCommandTimeout': 240,
            'appium:noReset': env.appSource === 'installed',
            ...androidAppCapabilities(),
        },
    ],
};
