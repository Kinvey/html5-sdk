// Allow tests to be written in es6
require('babel-core/register');

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./**/*.test.js'],
  multiCapabilities: [
    {
      browserName: 'chrome',
      chromeOptions: {}
    }
    // { browserName: 'firefox' },
    // { browserName: 'safari' }
  ],
  baseUrl: 'http://localhost:3000',
  framework: 'mocha',
  mochaOpts: {
    timeout: 10000,
    reporter: 'spec',
  }
};
