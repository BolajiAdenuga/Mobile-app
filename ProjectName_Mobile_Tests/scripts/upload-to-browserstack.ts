import fs from 'node:fs';
import axios from 'axios';
import FormData from 'form-data';
import { env, requireEnv } from '../e2e/utils/env.utils.js';

/**
 * Uploads the Android/iOS build to BrowserStack App Automate once, so later
 * test runs reference it by id instead of re-uploading every time.
 *
 * Usage:
 *   npm run upload:browserstack:android
 *   npm run upload:browserstack:ios
 *
 * Prints a bs://<id> value — copy it into BROWSERSTACK_ANDROID_APP_ID or
 * BROWSERSTACK_IOS_APP_ID in .env.
 */
async function main(): Promise<void> {
    const platform = process.argv[2];
    if (platform !== 'android' && platform !== 'ios') {
        throw new Error('Usage: ts-node scripts/upload-to-browserstack.ts <android|ios>');
    }

    const appPath = platform === 'android' ? env.android.appPath : env.ios.appPath;
    if (!appPath || !fs.existsSync(appPath)) {
        throw new Error(
            `Could not find a build at "${appPath}". Set ANDROID_APP_PATH / IOS_APP_PATH in .env and ` +
                'place the .apk / .ipa under ./apps first (BrowserStack needs an .ipa, not a simulator .app).',
        );
    }

    const username = requireEnv('BROWSERSTACK_USERNAME');
    const accessKey = requireEnv('BROWSERSTACK_ACCESS_KEY');

    const form = new FormData();
    form.append('file', fs.createReadStream(appPath));

    const response = await axios.post('https://api-cloud.browserstack.com/app-automate/upload', form, {
        auth: { username, password: accessKey },
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
    });

    console.log(`Uploaded ${appPath} -> ${response.data.app_url}`);
    console.log(
        `Copy this into .env: BROWSERSTACK_${platform.toUpperCase()}_APP_ID=${response.data.app_url}`,
    );
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
