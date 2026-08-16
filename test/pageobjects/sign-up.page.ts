import {
    $,
    browser,
    expect,
} from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';

import {
    signUpAndroidLocators,
} from '../locators/android/sign-up.locators.js';

import {
    signUpIOSLocators,
} from '../locators/ios/sign-up.locators.js';

type LocatorMap =
    typeof signUpAndroidLocators |
    typeof signUpIOSLocators;

class SignUpPage {
    private get locators(): LocatorMap {
        return browser.isAndroid
            ? signUpAndroidLocators
            : signUpIOSLocators;
    }

    private get signUpLink(): ChainablePromiseElement {
        return $(this.locators.signUpLink);
    }

    private get signUpTitle(): ChainablePromiseElement {
        return $(this.locators.signUpTitle);
    }

    private get cancelButton(): ChainablePromiseElement {
        return $(this.locators.cancelButton);
    }

    private get submitButtonCandidates() {
        return $$(this.locators.submitButton);
    }

    private get businessNameRequired(): ChainablePromiseElement {
        return $(this.locators.businessNameRequired);
    }

    private get firstAndLastNameRequired(): ChainablePromiseElement {
        return $(this.locators.firstAndLastNameRequired);
    }

    private get emailRequired(): ChainablePromiseElement {
        return $(this.locators.emailRequired);
    }

    private get passwordRequired(): ChainablePromiseElement {
        return $(this.locators.passwordRequired);
    }

    private get confirmPasswordRequired(): ChainablePromiseElement {
        return $(this.locators.confirmPasswordRequired);
    }

    private get passwordsDoNotMatch(): ChainablePromiseElement {
        return $(this.locators.passwordsDoNotMatch);
    }

    private get dateOfBirthInput(): ChainablePromiseElement {
        return $(this.locators.dateOfBirthInput);
    }

    private get dateOfBirthPicker(): ChainablePromiseElement {
        return $(this.locators.dateOfBirthPicker);
    }

    private get dateOfBirthDoneButton(): ChainablePromiseElement {
        return $(this.locators.dateOfBirthDoneButton);
    }

    private get phoneRequired(): ChainablePromiseElement {
        return $(this.locators.phoneRequired);
    }

    private get addressRequired(): ChainablePromiseElement {
        return $(this.locators.addressRequired);
    }

    private get cityRequired(): ChainablePromiseElement {
        return $(this.locators.cityRequired);
    }

    private get stateRequired(): ChainablePromiseElement {
        return $(this.locators.stateRequired);
    }

    private get zipRequired(): ChainablePromiseElement {
        return $(this.locators.zipRequired);
    }

    private get privacyPolicySwitch(): ChainablePromiseElement {
        return $(this.locators.privacyPolicySwitch);
    }

    private get termsAndConditionsSwitch(): ChainablePromiseElement {
        return $(this.locators.termsAndConditionsSwitch);
    }

    private get privacyPolicyRequired(): ChainablePromiseElement {
        return $(this.locators.privacyPolicyRequired);
    }

    private get termsAndConditionsRequired(): ChainablePromiseElement {
        return $(this.locators.termsAndConditionsRequired);
    }

    public async openFromSignIn():
        Promise<void> {
        const link =
            this.signUpLink;

        await link.waitForDisplayed({
            timeout: 20_000,
            timeoutMsg:
                'The Sign Up link was not displayed on Sign In.',
        });

        await link.click();

        console.log(
            'The Sign Up link was tapped.'
        );
    }

    public async verifyPageIsDisplayed():
        Promise<void> {
        const title =
            this.signUpTitle;

        await title.waitForDisplayed({
            timeout: 25_000,
            timeoutMsg:
                'The Sign Up title was not displayed.',
        });

        await expect(title).toBeDisplayed();

        console.log(
            'The Sign Up screen title was displayed.'
        );
    }

    private async getAndroidEditableField(
        visibleText: string
    ): Promise<ChainablePromiseElement> {
        const selector =
            'android=new UiScrollable(' +
            'new UiSelector().scrollable(true))' +
            '.scrollIntoView(' +
            'new UiSelector()' +
            '.className("android.widget.EditText")' +
            '.text("' +
            visibleText +
            '"))';

        const field =
            await $(selector);

        await field.waitForDisplayed({
            timeout: 25_000,
            timeoutMsg:
                `The editable "${visibleText}" field was not displayed.`,
        });

        await field.waitForEnabled({
            timeout: 15_000,
            timeoutMsg:
                `The editable "${visibleText}" field was not enabled.`,
        });

        const className =
            await field.getAttribute('className');

        if (
            className !==
            'android.widget.EditText'
        ) {
            throw new Error(
                `The "${visibleText}" locator returned ` +
                `"${className}" instead of android.widget.EditText.`
            );
        }

        return field;
    }

    private async focusAndroidField(
        field: ChainablePromiseElement,
        visibleText: string
    ): Promise<void> {
        await field.click();
        await browser.pause(600);

        const focused =
            await field
                .getAttribute('focused')
                .catch(() => 'false');

        if (focused !== 'true') {
            console.log(
                `${visibleText} did not receive focus after click. ` +
                'Retrying with element-center clickGesture.'
            );

            const location =
                await field.getLocation();

            const size =
                await field.getSize();

            const x =
                Math.round(
                    location.x +
                    (size.width / 2)
                );

            const y =
                Math.round(
                    location.y +
                    (size.height / 2)
                );

            await browser.execute(
                'mobile: clickGesture',
                {
                    x,
                    y,
                }
            );

            await browser.pause(600);
        }
    }

    private async clearAndroidField(
        field: ChainablePromiseElement
    ): Promise<void> {
        try {
            await field.clearValue();
            await browser.pause(250);
        } catch {
            /*
             * Some native fields reject clearValue while
             * they contain only placeholder text.
             */
        }
    }

    private async typeAndroidFieldValue(
        field: ChainablePromiseElement,
        visibleText: string,
        value: string
    ): Promise<void> {
        try {
            await field.addValue(value);
        } catch {
            console.log(
                `addValue failed for ${visibleText}. ` +
                'Retrying with setValue().'
            );

            await field.setValue(value);
        }

        await browser.pause(350);
    }

    private async hideAndroidKeyboard():
        Promise<void> {
        try {
            await browser.hideKeyboard();
            await browser.pause(400);
        } catch {
            // The keyboard may already be closed.
        }
    }

    private async enterAndroidField(
        visibleText: string,
        value: string
    ): Promise<void> {
        const field =
            await this.getAndroidEditableField(
                visibleText
            );

        await this.focusAndroidField(
            field,
            visibleText
        );

        await this.clearAndroidField(field);

        await this.typeAndroidFieldValue(
            field,
            visibleText,
            value
        );

        await this.hideAndroidKeyboard();

        console.log(
            `Entered a value in the ${visibleText} field.`
        );
    }

    public async enterBusinessName(
        value: string
    ): Promise<void> {
        await this.enterAndroidField(
            'Business Name',
            value
        );
    }

    public async enterContactName(
        value: string
    ): Promise<void> {
        await this.enterAndroidField(
            'First & Last Name',
            value
        );
    }

    public async enterSignUpEmail(
        value: string
    ): Promise<void> {
        await this.enterAndroidField(
            'Email',
            value
        );
    }

    public async enterSignUpPassword(
        value: string
    ): Promise<void> {
        await this.enterAndroidField(
            'Password',
            value
        );
    }

    public async enterConfirmPassword(
        value: string
    ): Promise<void> {
        await this.enterAndroidField(
            'Confirm Password',
            value
        );
    }

    public async enterMobilePhone(
        value: string
    ): Promise<void> {
        await this.enterAndroidField(
            'Mobile Phone',
            value
        );
    }

    public async enterAddressOne(
        value: string
    ): Promise<void> {
        await this.enterAndroidField(
            'Address 01',
            value
        );
    }

    public async enterAddressTwo(
        value: string
    ): Promise<void> {
        await this.enterAndroidField(
            'Address 02',
            value
        );
    }

    public async enterCity(
        value: string
    ): Promise<void> {
        await this.enterAndroidField(
            'City',
            value
        );
    }

    public async enterState(
        value: string
    ): Promise<void> {
        await this.enterAndroidField(
            'State',
            value
        );
    }

    public async enterZip(
        value: string
    ): Promise<void> {
        await this.enterAndroidField(
            'Zip',
            value
        );
    }

    /**
     * Completes every required text input while leaving
     * Privacy Policy and Terms & Conditions switched off.
     */
    public async completeRequiredFieldsWithValidData():
        Promise<void> {
        if (!browser.isAndroid) {
            throw new Error(
                'The legal-policy validation data-entry flow ' +
                'is currently configured for Android only.'
            );
        }

        const uniqueEmail =
            `qa.privacy.${Date.now()}@tepia.co`;

        await this.enterBusinessName(
            'Automation Test Business'
        );

        await this.enterContactName(
            'Automation Tester'
        );

        await this.enterSignUpEmail(
            uniqueEmail
        );

        await this.enterSignUpPassword(
            'Password1!'
        );

        await this.enterConfirmPassword(
            'Password1!'
        );

        await this.enterMobilePhone(
            '5551234567'
        );

        await this.enterAddressOne(
            '123 Automation Street'
        );

        await this.enterCity(
            'Miami'
        );

        await this.enterState(
            'Florida'
        );

        await this.enterZip(
            '33101'
        );

        console.log(
            'All required Sign Up text fields were completed.'
        );
    }

    /**
     * Completes every required text input using a Confirm
     * Password value that differs from the Password value.
     */
    public async completeRequiredFieldsWithMismatchedPasswords():
        Promise<void> {
        if (!browser.isAndroid) {
            throw new Error(
                'The mismatched-password data-entry flow ' +
                'is currently configured for Android only.'
            );
        }

        await this.enterBusinessName(
            'Automation Test Business'
        );

        await this.enterContactName(
            'Automation Tester'
        );

        await this.enterSignUpEmail(
            `qa.mismatch.${Date.now()}@tepia.co`
        );

        await this.enterSignUpPassword(
            'Password1!'
        );

        await this.enterConfirmPassword(
            'Different1!'
        );

        await this.enterMobilePhone(
            '5551234567'
        );

        await this.enterAddressOne(
            '123 Automation Street'
        );

        await this.enterCity(
            'Miami'
        );

        await this.enterState(
            'Florida'
        );

        await this.enterZip(
            '33101'
        );

        console.log(
            'Sign Up fields were completed with ' +
            'mismatched passwords.'
        );
    }

    public async verifyPasswordsDoNotMatchMessage():
        Promise<void> {
        await this.ensureValidationDisplayed(
            this.passwordsDoNotMatch,
            'Passwords do not match'
        );

        await expect(
            this.passwordsDoNotMatch
        ).toBeDisplayed();
    }

    /**
     * Opens the Date of Birth picker and confirms it.
     */
    public async selectDateOfBirth():
        Promise<void> {
        const field = this.dateOfBirthInput;

        await field.waitForDisplayed({
            timeout: 15_000,
            timeoutMsg:
                'The Date of Birth field was not displayed.',
        });

        await field.click();

        await this.dateOfBirthPicker.waitForDisplayed({
            timeout: 15_000,
            timeoutMsg:
                'The Date of Birth picker was not displayed.',
        });

        const doneButton =
            this.dateOfBirthDoneButton;

        await doneButton.waitForDisplayed({
            timeout: 10_000,
            timeoutMsg:
                'The Date of Birth picker Done button ' +
                'was not displayed.',
        });

        await doneButton.click();
        await browser.pause(800);

        console.log(
            'A Date of Birth value was selected.'
        );
    }

    /**
     * Confirms that both legal-policy switches remain OFF.
     */
    public async leaveLegalPolicySwitchesOff():
        Promise<void> {
        await this.scrollToBottom();

        const privacySwitch =
            this.privacyPolicySwitch;

        const termsSwitch =
            this.termsAndConditionsSwitch;

        await privacySwitch.waitForDisplayed({
            timeout: 15_000,
            timeoutMsg:
                'The Privacy Policy switch was not displayed.',
        });

        await termsSwitch.waitForDisplayed({
            timeout: 15_000,
            timeoutMsg:
                'The Terms and Conditions switch was not displayed.',
        });

        const privacyChecked =
            await privacySwitch.getAttribute('checked');

        const termsChecked =
            await termsSwitch.getAttribute('checked');

        if (privacyChecked === 'true') {
            await privacySwitch.click();
        }

        if (termsChecked === 'true') {
            await termsSwitch.click();
        }

        console.log(
            'Privacy Policy and Terms & Conditions remained OFF.'
        );
    }

    public async verifyPrivacyPolicyRequiredMessage():
        Promise<void> {
        await this.ensureValidationDisplayed(
            this.privacyPolicyRequired,
            'Privacy Policy'
        );

        await expect(
            this.privacyPolicyRequired
        ).toBeDisplayed();
    }

    public async verifyTermsAndConditionsRequiredMessage():
        Promise<void> {
        await this.ensureValidationDisplayed(
            this.termsAndConditionsRequired,
            'Terms and Conditions'
        );

        await expect(
            this.termsAndConditionsRequired
        ).toBeDisplayed();
    }

    public async tapCancelButton():
        Promise<void> {
        const cancel =
            this.cancelButton;

        await cancel.waitForDisplayed({
            timeout: 20_000,
            timeoutMsg:
                'The Sign Up Cancel control was not displayed.',
        });

        await cancel.waitForEnabled({
            timeout: 15_000,
            timeoutMsg:
                'The Sign Up Cancel control was not enabled.',
        });

        console.log(
            'Tapping the Sign Up Cancel control.'
        );

        await cancel.click();

        console.log(
            'The Sign Up Cancel control was tapped.'
        );
    }

    public async leaveAllFieldsBlank():
        Promise<void> {
        /*
         * This step intentionally performs no input.
         * It documents that every registration field
         * remains empty before submission.
         */
        console.log(
            'All Sign Up registration fields were left blank.'
        );
    }

    private async scrollDownOnce():
        Promise<void> {
        const size =
            await browser.getWindowSize();

        const centerX =
            Math.round(size.width * 0.5);

        const startY =
            Math.round(size.height * 0.78);

        const endY =
            Math.round(size.height * 0.28);

        await browser.performActions([
            {
                type: 'pointer',
                id: 'finger',
                parameters: {
                    pointerType: 'touch',
                },
                actions: [
                    {
                        type: 'pointerMove',
                        duration: 0,
                        x: centerX,
                        y: startY,
                    },
                    {
                        type: 'pointerDown',
                        button: 0,
                    },
                    {
                        type: 'pause',
                        duration: 250,
                    },
                    {
                        type: 'pointerMove',
                        duration: 650,
                        x: centerX,
                        y: endY,
                    },
                    {
                        type: 'pointerUp',
                        button: 0,
                    },
                ],
            },
        ]);
    }

    private async getVisibleBottomSignUpButton():
        Promise<WebdriverIO.Element | null> {
        const candidates =
            await this.submitButtonCandidates;

        const visibleCandidates:
            Array<{
                element: WebdriverIO.Element;
                y: number;
                height: number;
            }> = [];

        for (const candidate of candidates) {
            const displayed =
                await candidate
                    .isDisplayed()
                    .catch(() => false);

            if (!displayed) {
                continue;
            }

            const enabled =
                await candidate
                    .isEnabled()
                    .catch(() => false);

            if (!enabled) {
                continue;
            }

            const location =
                await candidate.getLocation();

            const size =
                await candidate.getSize();

            visibleCandidates.push({
                element: candidate,
                y: location.y,
                height: size.height,
            });
        }

        if (visibleCandidates.length === 0) {
            return null;
        }

        /*
         * The actual submit button is the lowest visible
         * Sign Up element on the screen. This avoids
         * selecting the Sign Up title at the top.
         */
        visibleCandidates.sort(
            (first, second): number => {
                return (
                    second.y +
                    second.height
                ) - (
                    first.y +
                    first.height
                );
            }
        );

        return visibleCandidates[0].element;
    }

    public async scrollToBottom():
        Promise<void> {
        for (
            let attempt = 1;
            attempt <= 8;
            attempt += 1
        ) {
            const button =
                await this.getVisibleBottomSignUpButton();

            if (button) {
                const location =
                    await button.getLocation();

                /*
                 * Ignore the page title near the top.
                 * The actual submit control appears in
                 * the lower half of the viewport.
                 */
                const windowSize =
                    await browser.getWindowSize();

                if (
                    location.y >
                    windowSize.height * 0.45
                ) {
                    console.log(
                        `Sign Up button displayed after ${attempt - 1} scroll(s).`
                    );

                    return;
                }
            }

            await this.scrollDownOnce();
            await browser.pause(500);
        }

        const finalButton =
            await this.getVisibleBottomSignUpButton();

        if (!finalButton) {
            throw new Error(
                'The bottom Sign Up button was not displayed after scrolling.'
            );
        }
    }

    public async submitEmptyForm():
        Promise<void> {
        const button =
            await this.getVisibleBottomSignUpButton();

        if (!button) {
            throw new Error(
                'The bottom Sign Up button was not found.'
            );
        }

        const location =
            await button.getLocation();

        const size =
            await button.getSize();

        console.log(
            'Selected bottom Sign Up button: ' +
            `x=${location.x}, y=${location.y}, ` +
            `width=${size.width}, height=${size.height}.`
        );

        await button.click();

        console.log(
            'The empty Sign Up form was submitted.'
        );

        await browser.pause(1_500);
    }

    private async ensureValidationDisplayed(
        validationElement:
            ChainablePromiseElement,
        description: string
    ): Promise<void> {
        /*
         * Required messages are distributed across the
         * long form. Search by scrolling upward and downward
         * until the requested validation is visible.
         */
        for (
            let attempt = 1;
            attempt <= 8;
            attempt += 1
        ) {
            const displayed =
                await validationElement
                    .isDisplayed()
                    .catch(() => false);

            if (displayed) {
                console.log(
                    `${description} validation was displayed.`
                );

                return;
            }

            if (browser.isAndroid) {
                await browser.execute(
                    'mobile: scrollGesture',
                    {
                        left: 0,
                        top: 150,
                        width:
                            (await browser.getWindowSize()).width,
                        height:
                            Math.max(
                                300,
                                (await browser.getWindowSize()).height - 250
                            ),
                        direction:
                            attempt <= 4
                                ? 'up'
                                : 'down',
                        percent: 0.75,
                    }
                );
            } else {
                const size =
                    await browser.getWindowSize();

                await browser.execute(
                    'mobile: swipe',
                    {
                        direction:
                            attempt <= 4
                                ? 'down'
                                : 'up',
                        velocity: 1000,
                        x:
                            Math.round(size.width / 2),
                        y:
                            Math.round(size.height / 2),
                    }
                );
            }

            await browser.pause(400);
        }

        await validationElement.waitForDisplayed({
            timeout: 5_000,
            timeoutMsg:
                `${description} validation was not displayed.`,
        });
    }

    public async verifyMandatoryValidationMessages():
        Promise<void> {
        const validations:
            Array<{
                element: ChainablePromiseElement;
                description: string;
            }> = [
                {
                    element:
                        this.businessNameRequired,
                    description:
                        'Business Name',
                },
                {
                    element:
                        this.firstAndLastNameRequired,
                    description:
                        'First and Last Name',
                },
                {
                    element:
                        this.emailRequired,
                    description:
                        'Email',
                },
                {
                    element:
                        this.passwordRequired,
                    description:
                        'Password',
                },
                {
                    element:
                        this.confirmPasswordRequired,
                    description:
                        'Confirm Password',
                },
                {
                    element:
                        this.phoneRequired,
                    description:
                        'Mobile Phone',
                },
                {
                    element:
                        this.addressRequired,
                    description:
                        'Address 01',
                },
                {
                    element:
                        this.cityRequired,
                    description:
                        'City',
                },
                {
                    element:
                        this.stateRequired,
                    description:
                        'State',
                },
                {
                    element:
                        this.zipRequired,
                    description:
                        'Zip',
                },
            ];

        for (const validation of validations) {
            await this.ensureValidationDisplayed(
                validation.element,
                validation.description
            );

            await expect(
                validation.element
            ).toBeDisplayed();
        }

        console.log(
            'All mandatory Sign Up validation messages were displayed.'
        );
    }
}

export default new SignUpPage();