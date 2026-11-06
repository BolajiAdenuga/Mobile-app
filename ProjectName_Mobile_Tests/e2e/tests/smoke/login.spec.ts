import { expect } from '@wdio/globals';
import LoginPage from '../../page-objects/login.po.js';
import HomePage from '../../page-objects/home.po.js';

describe('Login', () => {
    // Replace with real test credentials, ideally from .env, not hardcoded.
    it('logs in successfully with valid credentials and lands on home', async () => {
        await LoginPage.login('test.user@sanofi.com', 'ReplaceWithRealTestPassword');

        await expect(HomePage.welcomeBanner).toBeDisplayed();
    });

    it('shows an error message for invalid credentials', async () => {
        await LoginPage.login('test.user@sanofi.com', 'wrong-password');

        await expect(LoginPage.errorMessage).toBeDisplayed();
    });
});
