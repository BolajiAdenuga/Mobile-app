import { sharedConfig } from './wdio.shared.conf.js';
import { env } from '../e2e/utils/env.utils.js';
import { androidAppCapabilities } from '../e2e/utils/app.utils.js';

/**
 * Runs on Jenkins against an emulator the pipeline already booted (see
 * ci/Jenkinsfile), connecting to an Appium server the pipeline already
 * started. No `services` entry here on purpose: Jenkins owns the Appium
 * process lifecycle so its logs land in the Jenkins console/log archive.
 */
export const config: WebdriverIO.Config = {
    ...sharedConfig,

    hostname: env.appium.host,
    port: env.appium.port,

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
