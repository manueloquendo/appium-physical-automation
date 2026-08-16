import {
    When,
    Then,
} from '@wdio/cucumber-framework';

import SignUpPage from '../pageobjects/sign-up.page.js';

/**
 * The Given step:
 * "the user is on the Sign In screen"
 *
 * remains in authentication.steps.ts.
 */
When(
    'the user taps the Sign Up link',
    async function (): Promise<void> {
        await SignUpPage.openFromSignIn();
    }
);

Then(
    'the Sign Up screen should be displayed',
    async function (): Promise<void> {
        await SignUpPage.verifyPageIsDisplayed();
    }
);

When(
    'the user leaves all registration fields blank',
    async function (): Promise<void> {
        await SignUpPage.leaveAllFieldsBlank();
    }
);

When(
    'the user scrolls to the bottom of the Sign Up screen',
    async function (): Promise<void> {
        await SignUpPage.scrollToBottom();
    }
);

When(
    'the user taps the Sign Up button',
    async function (): Promise<void> {
        await SignUpPage.submitEmptyForm();
    }
);

Then(
    'all mandatory Sign Up field validation messages should be displayed',
    async function (): Promise<void> {
        await SignUpPage
            .verifyMandatoryValidationMessages();
    }
);

When(
    'the user completes all required Sign Up fields with valid data',
    async function (): Promise<void> {
        await SignUpPage
            .completeRequiredFieldsWithValidData();
    }
);

When(
    'the user leaves the Privacy Policy and Terms & Conditions switches off',
    async function (): Promise<void> {
        await SignUpPage
            .leaveLegalPolicySwitchesOff();
    }
);

When(
    'the user completes the Sign Up fields with mismatched passwords',
    async function (): Promise<void> {
        await SignUpPage
            .completeRequiredFieldsWithMismatchedPasswords();
    }
);

Then(
    'the passwords do not match validation message should be displayed',
    async function (): Promise<void> {
        await SignUpPage
            .verifyPasswordsDoNotMatchMessage();
    }
);

Then(
    'the Privacy Policy required validation message should be displayed',
    async function (): Promise<void> {
        await SignUpPage
            .verifyPrivacyPolicyRequiredMessage();
    }
);

Then(
    'the Terms and Conditions required validation message should be displayed',
    async function (): Promise<void> {
        await SignUpPage
            .verifyTermsAndConditionsRequiredMessage();
    }
);