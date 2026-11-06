import { env } from './env.utils.js';

/**
 * Builds the Appium capability keys that decide how the app under test gets
 * onto the device: either installed from a local binary, or attached to a
 * build a human already installed via TestFlight / the Firebase App Tester
 * app. See README.md "App under test strategy".
 */
export function androidAppCapabilities(): Record<string, string> {
    if (env.appSource === 'installed') {
        return {
            'appium:appPackage': env.android.appPackage,
            'appium:appActivity': env.android.appActivity,
        };
    }
    return { 'appium:app': env.android.appPath };
}

export function iosAppCapabilities(): Record<string, string> {
    if (env.appSource === 'installed') {
        return { 'appium:bundleId': env.ios.bundleId };
    }
    return { 'appium:app': env.ios.appPath };
}
