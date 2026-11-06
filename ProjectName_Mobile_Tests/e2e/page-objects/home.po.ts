import { $ } from '@wdio/globals';
import BasePage from './base.po.js';

/** TEMPLATE page object — see login.po.ts for selector-strategy notes. */
class HomePage extends BasePage {
    get welcomeBanner() {
        return $('~home_welcome_banner');
    }

    get menuButton() {
        return $('~home_menu_button');
    }

    async isLoaded(): Promise<boolean> {
        return this.isDisplayed(this.welcomeBanner);
    }
}

export default new HomePage();
