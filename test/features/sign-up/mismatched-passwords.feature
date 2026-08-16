@mobile @android @ios @sign-up @negative @regression
Feature: Sign Up - Mismatched Passwords Validation

  Scenario: Block registration when the Password and Confirm Password values differ
    Given the user is on the Sign In screen
    When the user taps the Sign Up link
    Then the Sign Up screen should be displayed
    When the user completes the Sign Up fields with mismatched passwords
    And the user scrolls to the bottom of the Sign Up screen
    And the user taps the Sign Up button
    Then the passwords do not match validation message should be displayed
