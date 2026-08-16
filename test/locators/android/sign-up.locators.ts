/**
 * Android locators for the Sign Up flow.
 */
export const signUpAndroidLocators = {
    signUpLink:
        'android=new UiSelector()' +
        '.textMatches("(?i)^sign\\s*up$")',

    signUpTitle:
        'android=new UiSelector()' +
        '.className("android.widget.TextView")' +
        '.textMatches("(?i)^sign\\s*up$")',

    businessNameInput:
        'android=new UiSelector()' +
        '.text("Business Name")',

    firstAndLastNameInput:
        'android=new UiSelector()' +
        '.text("First & Last Name")',

    emailInput:
        'android=new UiSelector()' +
        '.text("Email")',

    passwordInput:
        'android=new UiSelector()' +
        '.text("Password")',

    confirmPasswordInput:
        'android=new UiSelector()' +
        '.text("Confirm Password")',

    mobilePhoneInput:
        'android=new UiSelector()' +
        '.text("Mobile Phone")',

    addressOneInput:
        'android=new UiSelector()' +
        '.text("Address 01")',

    cityInput:
        'android=new UiSelector()' +
        '.text("City")',

    stateInput:
        'android=new UiSelector()' +
        '.text("State")',

    zipInput:
        'android=new UiSelector()' +
        '.text("Zip")',

    cancelButton:
        'android=new UiSelector()' +
        '.textMatches("(?i)^cancel$")',

    submitButton:
        'android=new UiSelector()' +
        '.textMatches("(?i)^sign\\s*up$")',

    businessNameRequired:
        'android=new UiSelector()' +
        '.textContains("Business Name is required")',

    firstAndLastNameRequired:
        'android=new UiSelector()' +
        '.textContains("First and last names are required")',

    emailRequired:
        'android=new UiSelector()' +
        '.textContains("An email address is required")',

    passwordRequired:
        'android=new UiSelector()' +
        '.textContains("Password is required")',

    confirmPasswordRequired:
        'android=new UiSelector()' +
        '.textContains("Confirm Passwords is required")',

    passwordsDoNotMatch:
        'android=new UiSelector()' +
        '.textContains("Passwords do not match")',

    dateOfBirthInput:
        'android=new UiSelector()' +
        '.textContains("Date of Birth")',

    dateOfBirthPicker:
        'android=new UiSelector()' +
        '.textContains("Select Date Of Birth")',

    dateOfBirthDoneButton:
        'android=new UiSelector()' +
        '.textContains("Done")',

    phoneRequired:
        'android=new UiSelector()' +
        '.textContains("A phone number is required")',

    addressRequired:
        'android=new UiSelector()' +
        '.textContains("An Address is required")',

    cityRequired:
        'android=new UiSelector()' +
        '.textContains("A City is required")',

    stateRequired:
        'android=new UiSelector()' +
        '.textContains("A State is required")',

    zipRequired:
        'android=new UiSelector()' +
        '.textContains("A Zip is required")',

    privacyPolicySwitch:
        'android=new UiSelector()' +
        '.className("android.widget.Switch")' +
        '.instance(0)',

    termsAndConditionsSwitch:
        'android=new UiSelector()' +
        '.className("android.widget.Switch")' +
        '.instance(1)',

    privacyPolicyRequired:
        'android=new UiSelector()' +
        '.textContains(' +
        '"You need to accept the privacy policy to continue"' +
        ')',

    termsAndConditionsRequired:
        'android=new UiSelector()' +
        '.textContains(' +
        '"You need to accept the terms & conditions to continue"' +
        ')',
} as const;