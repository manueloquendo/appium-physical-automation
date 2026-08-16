/**
 * iOS locators for the Sign Up flow.
 */
export const signUpIOSLocators = {
    signUpLink:
        '-ios predicate string:' +
        '(name ==[c] "Sign Up" OR label ==[c] "Sign Up")',

    signUpTitle:
        '-ios predicate string:' +
        'type == "XCUIElementTypeStaticText" ' +
        'AND (name ==[c] "Sign Up" OR label ==[c] "Sign Up")',

    cancelButton:
        '-ios predicate string:' +
        'type == "XCUIElementTypeOther" ' +
        'AND (name ==[c] "Cancel" OR label ==[c] "Cancel")',

    submitButton:
        '-ios predicate string:' +
        'type == "XCUIElementTypeOther" ' +
        'AND (name ==[c] "Sign Up" OR label ==[c] "Sign Up")',

    businessNameRequired:
        '-ios predicate string:' +
        '(name CONTAINS[c] "Business Name is required" ' +
        'OR label CONTAINS[c] "Business Name is required" ' +
        'OR value CONTAINS[c] "Business Name is required")',

    firstAndLastNameRequired:
        '-ios predicate string:' +
        '(name CONTAINS[c] "First and last names are required" ' +
        'OR label CONTAINS[c] "First and last names are required" ' +
        'OR value CONTAINS[c] "First and last names are required")',

    emailRequired:
        '-ios predicate string:' +
        '(name CONTAINS[c] "An email address is required" ' +
        'OR label CONTAINS[c] "An email address is required" ' +
        'OR value CONTAINS[c] "An email address is required")',

    passwordRequired:
        '-ios predicate string:' +
        '(name CONTAINS[c] "Password is required" ' +
        'OR label CONTAINS[c] "Password is required" ' +
        'OR value CONTAINS[c] "Password is required")',

    confirmPasswordRequired:
        '-ios predicate string:' +
        '(name CONTAINS[c] "Confirm Passwords is required" ' +
        'OR label CONTAINS[c] "Confirm Passwords is required" ' +
        'OR value CONTAINS[c] "Confirm Passwords is required")',

    passwordsDoNotMatch:
        '-ios predicate string:' +
        '(name CONTAINS[c] "Passwords do not match" ' +
        'OR label CONTAINS[c] "Passwords do not match" ' +
        'OR value CONTAINS[c] "Passwords do not match")',

    dateOfBirthInput:
        '-ios predicate string:' +
        '(name CONTAINS[c] "Date of Birth" ' +
        'OR label CONTAINS[c] "Date of Birth" ' +
        'OR value CONTAINS[c] "Date of Birth")',

    dateOfBirthPicker:
        '-ios predicate string:' +
        '(name CONTAINS[c] "Select Date Of Birth" ' +
        'OR label CONTAINS[c] "Select Date Of Birth")',

    dateOfBirthDoneButton:
        '-ios predicate string:' +
        '(name CONTAINS[c] "Done" OR label CONTAINS[c] "Done")',

    phoneRequired:
        '-ios predicate string:' +
        '(name CONTAINS[c] "A phone number is required" ' +
        'OR label CONTAINS[c] "A phone number is required" ' +
        'OR value CONTAINS[c] "A phone number is required")',

    addressRequired:
        '-ios predicate string:' +
        '(name CONTAINS[c] "An Address is required" ' +
        'OR label CONTAINS[c] "An Address is required" ' +
        'OR value CONTAINS[c] "An Address is required")',

    cityRequired:
        '-ios predicate string:' +
        '(name CONTAINS[c] "A City is required" ' +
        'OR label CONTAINS[c] "A City is required" ' +
        'OR value CONTAINS[c] "A City is required")',

    stateRequired:
        '-ios predicate string:' +
        '(name CONTAINS[c] "A State is required" ' +
        'OR label CONTAINS[c] "A State is required" ' +
        'OR value CONTAINS[c] "A State is required")',

    zipRequired:
        '-ios predicate string:' +
        '(name CONTAINS[c] "A Zip is required" ' +
        'OR label CONTAINS[c] "A Zip is required" ' +
        'OR value CONTAINS[c] "A Zip is required")',

    privacyPolicySwitch:
        '-ios class chain:**/XCUIElementTypeSwitch[1]',

    termsAndConditionsSwitch:
        '-ios class chain:**/XCUIElementTypeSwitch[2]',

    privacyPolicyRequired:
        '-ios predicate string:' +
        '(name CONTAINS[c] ' +
        '"You need to accept the privacy policy to continue" ' +
        'OR label CONTAINS[c] ' +
        '"You need to accept the privacy policy to continue" ' +
        'OR value CONTAINS[c] ' +
        '"You need to accept the privacy policy to continue")',

    termsAndConditionsRequired:
        '-ios predicate string:' +
        '(name CONTAINS[c] ' +
        '"You need to accept the terms & conditions to continue" ' +
        'OR label CONTAINS[c] ' +
        '"You need to accept the terms & conditions to continue" ' +
        'OR value CONTAINS[c] ' +
        '"You need to accept the terms & conditions to continue")',
} as const;