import fs from 'node:fs';
import path from 'node:path';
import { browser } from '@wdio/globals';

const SCREENSHOT_DIR = path.join(process.cwd(), 'reports', 'screenshots');

export async function saveScreenshot(name: string): Promise<string> {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    const safeName = name.replace(/[^a-z0-9-_]+/gi, '_');
    const filePath = path.join(SCREENSHOT_DIR, `${safeName}-${Date.now()}.png`);
    await browser.saveScreenshot(filePath);
    return filePath;
}
