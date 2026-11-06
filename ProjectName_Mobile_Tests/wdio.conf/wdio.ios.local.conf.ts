import { sharedConfig } from './wdio.shared.conf.js';
import { env } from '../e2e/utils/env.utils.js';
import { iosAppCapabilities } from '../e2e/utils/app.utils.js';

/**
 * Runs against a local iOS Simulator started by Xcode.
 * Only a .app bundle built for the simulator (not a real .ipa) can run here.
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
            platformName: 'iOS',
            'appium:automationName': 'XCUITest',
            'appium:deviceName': env.ios.deviceName,
            'appium:platformVersion': env.ios.platformVersion,
            'appium:newCommandTimeout': 240,
            'appium:noReset': env.appSource === 'installed',
            ...iosAppCapabilities(),
        },
    ],
};
