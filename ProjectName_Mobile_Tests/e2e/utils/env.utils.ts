import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}. Copy .env.example to .env and fill it in.`);
    }
    return value;
}

function optionalEnv(name: string, fallback = ''): string {
    return process.env[name] ?? fallback;
}

export const env = {
    appSource: optionalEnv('APP_SOURCE', 'file') as 'file' | 'installed',

    android: {
        appPath: optionalEnv('ANDROID_APP_PATH'),
        appPackage: optionalEnv('ANDROID_APP_PACKAGE'),
        appActivity: optionalEnv('ANDROID_APP_ACTIVITY'),
        deviceName: optionalEnv('ANDROID_DEVICE_NAME', 'Pixel_7_API_34'),
        platformVersion: optionalEnv('ANDROID_PLATFORM_VERSION', '14.0'),
    },

    ios: {
        appPath: optionalEnv('IOS_APP_PATH'),
        bundleId: optionalEnv('IOS_BUNDLE_ID'),
        deviceName: optionalEnv('IOS_DEVICE_NAME', 'iPhone 15'),
        platformVersion: optionalEnv('IOS_PLATFORM_VERSION', '17.5'),
    },

    appium: {
        host: optionalEnv('APPIUM_HOST', '127.0.0.1'),
        port: Number(optionalEnv('APPIUM_PORT', '4723')),
    },

    browserstack: {
        username: optionalEnv('BROWSERSTACK_USERNAME'),
        accessKey: optionalEnv('BROWSERSTACK_ACCESS_KEY'),
        androidAppId: optionalEnv('BROWSERSTACK_ANDROID_APP_ID'),
        iosAppId: optionalEnv('BROWSERSTACK_IOS_APP_ID'),
        // BrowserStack's real-device catalog names devices differently to a
        // local AVD/simulator (e.g. "Google Pixel 7" vs "Pixel_7_API_34"),
        // so these are deliberately separate from android.deviceName/ios.deviceName.
        androidDeviceName: optionalEnv('BROWSERSTACK_ANDROID_DEVICE', 'Google Pixel 8'),
        androidOsVersion: optionalEnv('BROWSERSTACK_ANDROID_OS_VERSION', '14.0'),
        iosDeviceName: optionalEnv('BROWSERSTACK_IOS_DEVICE', 'iPhone 15'),
        iosOsVersion: optionalEnv('BROWSERSTACK_IOS_OS_VERSION', '17'),
    },
};

export { requireEnv };
