import { sharedConfig } from './wdio.shared.conf.js';
import { env } from '../e2e/utils/env.utils.js';
import { iosAppCapabilities } from '../e2e/utils/app.utils.js';

/**
 * Runs on a macOS Jenkins agent against a simulator the pipeline already
 * booted (see ci/Jenkinsfile). Requires a macOS node — iOS simulators cannot
 * run on Linux/Windows agents.
 */
export const config: WebdriverIO.Config = {
    ...sharedConfig,

    hostname: env.appium.host,
    port: env.appium.port,

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
