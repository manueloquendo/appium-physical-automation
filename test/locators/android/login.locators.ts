/**
 * Android locators for the Sign In screen.
 *
 * These selectors are used only when WebdriverIO
 * runs on an Android device.
 */
export const loginLocators = {
    /**
     * Email Address input field.
     */
    emailInput:
        '//android.widget.EditText[' +
        '@text="Email Address" ' +
        'or @hint="Email Address" ' +
        'or contains(@hint,"Email") ' +
        'or contains(@content-desc,"Email")' +
        ']',

    /**
     * Password input field.
     */
    passwordInput:
        '//android.widget.EditText[' +
        '@text="Password" ' +
        'or @hint="Password" ' +
        'or contains(@hint,"Password") ' +
        'or contains(@content-desc,"Password")' +
        ']',

    /**
     * Sign In button.
     */
    signInButton:
        '//*[' +
        '@text="Sign In" ' +
        'or @content-desc="Sign In" ' +
        'or contains(@text,"Sign In") ' +
        'or contains(@content-desc,"Sign In")' +
        ']',

    /**
     * Validation displayed when Email Address is empty.
     *
     * Expected visual message:
     * ^An email address is required
     */
    emailRequiredMessage:
        '//*[' +
        '@text="^An email address is required" ' +
        'or @content-desc="^An email address is required" ' +
        'or @text="An email address is required" ' +
        'or @content-desc="An email address is required" ' +
        'or contains(@text,"An email address is required") ' +
        'or contains(@content-desc,"An email address is required")' +
        ']',

    /**
     * Validation displayed when Password is empty.
     *
     * Expected visual message:
     * ^Password is required
     */
    passwordRequiredMessage:
        '//*[' +
        '@text="^Password is required" ' +
        'or @content-desc="^Password is required" ' +
        'or @text="Password is required" ' +
        'or @content-desc="Password is required" ' +
        'or contains(@text,"Password is required") ' +
        'or contains(@content-desc,"Password is required")' +
        ']',

    /**
     * Validation displayed when the Email Address
     * has an invalid format.
     *
     * Expected visual message:
     * ^The email format is invalid.
     */
    invalidEmailFormatMessage:
        '//*[' +
        '@text="^The email format is invalid." ' +
        'or @content-desc="^The email format is invalid." ' +
        'or @text="The email format is invalid." ' +
        'or @content-desc="The email format is invalid." ' +
        'or contains(@text,"The email format is invalid") ' +
        'or contains(@content-desc,"The email format is invalid") ' +
        'or contains(@text,"email format is invalid") ' +
        'or contains(@content-desc,"email format is invalid")' +
        ']',

    /**
     * Error banner or toast displayed after submitting
     * a valid email with an incorrect password.
     *
     * Expected error content:
     * auth/wrong-password
     */
    authenticationFailureMessage:
        '//*[' +
        'contains(@text,"auth/wrong-password") ' +
        'or contains(@content-desc,"auth/wrong-password") ' +
        'or contains(@text,"wrong-password") ' +
        'or contains(@content-desc,"wrong-password") ' +
        'or contains(@text,"Authentication failed") ' +
        'or contains(@content-desc,"Authentication failed") ' +
        'or contains(@text,"incorrect password") ' +
        'or contains(@content-desc,"incorrect password")' +
        ']',
} as const;