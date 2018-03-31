// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://54.191.86.94:81',
  // apiUrl: 'http://localhost:3000',
  otpDigit: 6,
  passwordMinLength: 6,
  passwordMaxLength: 20,
  mobileDigit: 10,
  maxCountOTP: 3,
  otpDisableTime: 1000 * 60 * 2 // 2 minutes
};
