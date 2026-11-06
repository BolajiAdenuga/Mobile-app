import { expect } from '@wdio/globals';
import LoginPage from '../../page-objects/login.po.js';
import HomePage from '../../page-objects/home.po.js';

describe('Home screen', () => {
    beforeEach(async () => {
        await LoginPage.login('test.user@sanofi.com', 'ReplaceWithRealTestPassword');
    });

    it('shows the menu button after login', async () => {
        await expect(HomePage.menuButton).toBeDisplayed();
    });
});
