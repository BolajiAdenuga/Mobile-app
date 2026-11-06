import type { ChainablePromiseElement } from 'webdriverio';

export default class BasePage {
    async waitAndClick(element: ChainablePromiseElement): Promise<void> {
        await element.waitForDisplayed();
        await element.click();
    }

    async waitAndSetValue(element: ChainablePromiseElement, value: string): Promise<void> {
        await element.waitForDisplayed();
        await element.setValue(value);
    }

    async isDisplayed(element: ChainablePromiseElement, timeout = 15000): Promise<boolean> {
        return element.waitForDisplayed({ timeout, reverse: false }).then(
            () => true,
            () => false,
        );
    }
}
