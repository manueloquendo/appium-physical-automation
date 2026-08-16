import {
    $,
    browser,
    expect,
} from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';

import {
    loginLocators as androidLoginLocators,
} from '../locators/android/login.locators.js';

import {
    loginLocators as iosLoginLocators,
} from '../locators/ios/login.locators.js';

type LoginLocatorCollection =
    Record<string, string>;

class LoginPage {
    /**
     * Selects the locator collection for the
     * current mobile platform.
     */
    private get locators():
        LoginLocatorCollection {
        return browser.isIOS
            ? iosLoginLocators
            : androidLoginLocators;
    }

    /**
     * Email Address input element.
     */
    private get emailInput() {
        return $(
            this.locators.emailInput
        );
    }

    /**
     * Password input element.
     */
    private get passwordInput() {
        return $(
            this.locators.passwordInput
        );
    }

    /**
     * Sign In control.
     */
    private get signInButton() {
        return $(
            this.locators.signInButton
        );
    }

    /**
     * Required Email Address validation element.
     */
    private get emailRequiredMessage() {
        return $(
            this.locators.emailRequiredMessage
        );
    }

    /**
     * Required Password validation element.
     */
    private get passwordRequiredMessage() {
        return $(
            this.locators.passwordRequiredMessage
        );
    }

    /**
     * Invalid email format validation element.
     */
    private get invalidEmailFormatMessage() {
        const locator =
            this.locators.invalidEmailFormatMessage;

        if (!locator) {
            throw new Error(
                'The invalidEmailFormatMessage locator ' +
                `is not configured for ${
                    browser.isIOS
                        ? 'iOS'
                        : 'Android'
                }.`
            );
        }

        return $(locator);
    }

    /**
     * Authentication failure banner or toast.
     */
    private get authenticationFailureMessage() {
        const locator =
            this.locators.authenticationFailureMessage;

        if (!locator) {
            throw new Error(
                'The authenticationFailureMessage locator ' +
                `is not configured for ${
                    browser.isIOS
                        ? 'iOS'
                        : 'Android'
                }.`
            );
        }

        return $(locator);
    }

    /**
     * Waits until the Sign In screen is ready.
     */
    public async waitForPageToLoad():
        Promise<void> {
        await this.emailInput.waitForDisplayed({
            timeout: 30_000,
            timeoutMsg:
                'The Email Address field was not displayed.',
        });

        await this.passwordInput.waitForDisplayed({
            timeout: 30_000,
            timeoutMsg:
                'The Password field was not displayed.',
        });

        await this.signInButton.waitForDisplayed({
            timeout: 30_000,
            timeoutMsg:
                'The Sign In button was not displayed.',
        });
    }

    /**
     * Enters an email address.
     */
    public async enterEmail(
        email: string
    ): Promise<void> {
        await this.emailInput.waitForDisplayed({
            timeout: 15_000,
            timeoutMsg:
                'The Email Address field was not displayed.',
        });

        await this.emailInput.click();

        try {
            await this.emailInput.clearValue();
        } catch {
            /*
             * The field may already be empty.
             */
        }

        await this.emailInput.setValue(
            email
        );
    }

    /**
     * Enters a password.
     */
    public async enterPassword(
        password: string
    ): Promise<void> {
        await this.passwordInput.waitForDisplayed({
            timeout: 15_000,
            timeoutMsg:
                'The Password field was not displayed.',
        });

        await this.passwordInput.click();

        try {
            await this.passwordInput.clearValue();
        } catch {
            /*
             * The field may already be empty.
             */
        }

        await this.passwordInput.setValue(
            password
        );

        await this.hideKeyboardIfDisplayed();
    }

    /**
     * Taps the Sign In button.
     */
    public async tapSignInButton():
        Promise<void> {
        await this.hideKeyboardIfDisplayed();

        await this.signInButton.waitForDisplayed({
            timeout: 15_000,
            timeoutMsg:
                'The Sign In button was not displayed.',
        });

        await this.signInButton.waitForEnabled({
            timeout: 15_000,
            timeoutMsg:
                'The Sign In button was not enabled.',
        });

        await this.signInButton.click();
    }

    /**
     * Submits the Sign In form with empty credentials.
     */
    public async tapSignInWithoutCredentials():
        Promise<void> {
        await this.waitForPageToLoad();

        await this.clearInputField(
            this.emailInput
        );

        await this.clearInputField(
            this.passwordInput
        );

        await this.hideKeyboardIfDisplayed();

        await this.signInButton.waitForDisplayed({
            timeout: 15_000,
            timeoutMsg:
                'The Sign In button was not displayed.',
        });

        await this.signInButton.waitForEnabled({
            timeout: 15_000,
            timeoutMsg:
                'The Sign In button was not enabled.',
        });

        await this.signInButton.click();
    }

    /**
     * Verifies the required Email Address message.
     */
    public async verifyEmailRequiredMessage():
        Promise<void> {
        const validationMessage =
            this.emailRequiredMessage;

        await validationMessage.waitForDisplayed({
            timeout: 20_000,
            timeoutMsg:
                'The Email Address required validation ' +
                'message was not displayed.',
        });

        const actualMessage =
            await this.getValidationMessageText(
                validationMessage
            );

        console.log(
            `Email required validation message: ` +
            `"${actualMessage}"`
        );

        await expect(
            validationMessage
        ).toBeDisplayed();

        await expect(
            actualMessage
        ).toContain(
            'An email address is required'
        );
    }

    /**
     * Verifies the required Password message.
     */
    public async verifyPasswordRequiredMessage():
        Promise<void> {
        const validationMessage =
            this.passwordRequiredMessage;

        await validationMessage.waitForDisplayed({
            timeout: 20_000,
            timeoutMsg:
                'The Password required validation ' +
                'message was not displayed.',
        });

        const actualMessage =
            await this.getValidationMessageText(
                validationMessage
            );

        console.log(
            `Password required validation message: ` +
            `"${actualMessage}"`
        );

        await expect(
            validationMessage
        ).toBeDisplayed();

        await expect(
            actualMessage
        ).toContain(
            'Password is required'
        );
    }

    /**
     * Verifies both blank-field messages.
     */
    public async verifyBlankFieldsValidation():
        Promise<void> {
        await this.verifyEmailRequiredMessage();
        await this.verifyPasswordRequiredMessage();
    }

    /**
     * Verifies the invalid email format message.
     */
    public async verifyInvalidEmailFormatMessage():
        Promise<void> {
        const validationMessage =
            this.invalidEmailFormatMessage;

        await validationMessage.waitForDisplayed({
            timeout: 20_000,
            timeoutMsg:
                'The invalid Email Address format ' +
                'validation message was not displayed.',
        });

        const actualMessage =
            await this.getValidationMessageText(
                validationMessage
            );

        console.log(
            `Invalid email format validation message: ` +
            `"${actualMessage}"`
        );

        await expect(
            validationMessage
        ).toBeDisplayed();

        await expect(
            actualMessage.toLowerCase()
        ).toContain(
            'the email format is invalid'
        );
    }

    /**
     * Verifies the authentication failure message
     * displayed after using an incorrect password.
     *
     * Expected error content:
     * auth/wrong-password
     */
    public async verifyAuthenticationFailureMessage():
        Promise<void> {
        const failureMessage =
            this.authenticationFailureMessage;

        let messageFoundInPageSource = false;

        await browser.waitUntil(async () => {
            try {
                if (await failureMessage.isDisplayed()) {
                    return true;
                }
            } catch {
                /* The message may be rendered outside a single native node. */
            }

            const pageSource =
                (await browser.getPageSource())
                    .toLowerCase()
                    .replace(/\s+/g, ' ');

            messageFoundInPageSource =
                pageSource.includes('auth/wrong-password') ||
                pageSource.includes('wrong-password') ||
                pageSource.includes('password is invalid') ||
                pageSource.includes('invalid password') ||
                pageSource.includes('invalid-credential') ||
                pageSource.includes('invalid credentials') ||
                pageSource.includes('authentication failed') ||
                pageSource.includes('incorrect password');

            return messageFoundInPageSource;
        }, {
            timeout: 30_000,
            interval: 1_000,
            timeoutMsg:
                'The authentication failure message ' +
                'was not displayed after submitting ' +
                'an incorrect password.',
        });

        const actualMessage = messageFoundInPageSource
            ? await browser.getPageSource()
            : await this.getValidationMessageText(failureMessage);

        console.log(
            `Authentication failure message: ` +
            `"${actualMessage}"`
        );

        await expect(
            failureMessage
        ).toBeDisplayed();

        const normalizedMessage =
            actualMessage.toLowerCase();

        const containsExpectedError =
            normalizedMessage.includes(
                'auth/wrong-password'
            ) ||
            normalizedMessage.includes(
                'wrong-password'
            ) ||
            normalizedMessage.includes(
                'incorrect password'
            ) ||
            normalizedMessage.includes(
                'authentication failed'
            );

        await expect(
            containsExpectedError
        ).toBe(true);
    }

    /**
     * Safely clears an input field.
     */
    private async clearInputField(
        element: ChainablePromiseElement
    ): Promise<void> {
        await element.waitForDisplayed({
            timeout: 15_000,
            timeoutMsg:
                'The input field was not displayed.',
        });

        await element.click();

        try {
            await element.clearValue();
        } catch {
            /*
             * Some native elements may already be empty.
             */
        }
    }

    /**
     * Gets text exposed through native Android
     * or iOS attributes.
     */
    private async getValidationMessageText(
        element: ChainablePromiseElement
    ): Promise<string> {
        try {
            const text =
                await element.getText();

            if (
                typeof text === 'string' &&
                text.trim().length > 0
            ) {
                return text.trim();
            }
        } catch {
            /*
             * Continue checking native attributes.
             */
        }

        const attributes =
            browser.isIOS
                ? [
                    'label',
                    'value',
                    'name',
                ]
                : [
                    'content-desc',
                    'text',
                ];

        for (const attribute of attributes) {
            try {
                const value =
                    await element.getAttribute(
                        attribute
                    );

                if (
                    typeof value === 'string' &&
                    value.trim().length > 0
                ) {
                    return value.trim();
                }
            } catch {
                /*
                 * Continue with the next attribute.
                 */
            }
        }

        return '';
    }

    /**
     * Hides the native keyboard when displayed.
     */
    private async hideKeyboardIfDisplayed():
        Promise<void> {
        try {
            if (browser.isAndroid) {
                await browser.hideKeyboard();
                return;
            }

            if (browser.isIOS) {
                await browser.execute(
                    'mobile: hideKeyboard',
                    {
                        keys: [
                            'Return',
                        ],
                    }
                );
            }
        } catch {
            /*
             * The keyboard may already be hidden.
             */
        }
    }
}

export default new LoginPage();