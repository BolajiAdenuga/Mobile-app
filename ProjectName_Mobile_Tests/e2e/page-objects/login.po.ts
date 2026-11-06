import { $ } from '@wdio/globals';
import BasePage from './base.po.js';

/**
 * TEMPLATE page object — replace the selectors below with your real app's
 * once you inspect it with the Appium Inspector (see README "Finding
 * selectors"). Uses `~` (accessibility id) selectors, which work on both
 * platforms IF Android sets the same `contentDescription` and iOS sets the
 * same `accessibilityIdentifier` for an element. Ask your dev teams to agree
 * on shared ids (e.g. "login_username_input") — it's the single biggest
 * thing that keeps one spec file working on both platforms instead of two.
 *
 * If a screen genuinely differs per platform, branch on `driver.isAndroid` /
 * `driver.isIOS` instead, e.g.:
 *   get usernameInput() {
 *       return driver.isAndroid
 *           ? $('android=new UiSelector().resourceId("com.sanofi.yourapp:id/username")')
 *           : $('-ios predicate string:name == "username_input"');
 *   }
 */
class LoginPage extends BasePage {
    get usernameInput() {
        return $('~login_username_input');
    }

    get passwordInput() {
        return $('~login_password_input');
    }

    get submitButton() {
        return $('~login_submit_button');
    }

    get errorMessage() {
        return $('~login_error_message');
    }

    async login(username: string, password: string): Promise<void> {
        await this.waitAndSetValue(this.usernameInput, username);
        await this.waitAndSetValue(this.passwordInput, password);
        await this.waitAndClick(this.submitButton);
    }
}

export default new LoginPage();
