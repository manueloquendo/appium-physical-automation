import { spawnSync } from 'node:child_process';

const SPECS = [
    './test/features/authentication/blank-fields-validation.feature',
    './test/features/authentication/invalid-email-format.feature',
    './test/features/authentication/incorrect-password.feature',
    './test/features/forgot-password/navigation-and-validation.feature',
    './test/features/forgot-password/unregistered-email.feature',
    './test/features/sign-up/mandatory-fields-validation.feature',
    './test/features/sign-up/mismatched-passwords.feature',
    './test/features/sign-up/terms-and-privacy-validation.feature',
    './test/features/forgot-password/successful-reset.feature',
    './test/features/sign-up/successful-registration.feature',
    './test/features/authentication/successful-login.feature',
];

const platform = process.argv[2];

if (platform !== 'android' && platform !== 'ios') {
    console.error('Usage: node scripts/run-suite.mjs <android|ios>');
    process.exit(2);
}

const configFile = `./config/wdio.${platform}.usb.conf.ts`;
const failedSpecs = [];

for (const spec of SPECS) {
    console.log(`\n=== Running ${spec} on ${platform} ===`);

    const result = spawnSync(
        'npx',
        ['wdio', 'run', configFile, '--spec', spec],
        { stdio: 'inherit', shell: true },
    );

    if (result.status !== 0) {
        failedSpecs.push(spec);
        console.log(`=== FAILED: ${spec} (exit code ${result.status}) ===`);
    }
}

console.log(`\n=== Suite summary (${platform}) ===`);
console.log(`Total: ${SPECS.length}, failed: ${failedSpecs.length}`);
failedSpecs.forEach((spec) => console.log(`  - ${spec}`));

process.exit(failedSpecs.length > 0 ? 1 : 0);
