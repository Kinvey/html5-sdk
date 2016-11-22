/* eslint-disable */
require('babel-core/register');
var browserstack = require('browserstack-local');

exports.config = {
  // =================
  // Service Providers
  // =================
  // WebdriverIO supports Sauce Labs, Browserstack and Testing Bot (other cloud providers
  // should work too though). These services define specific user and key (or access key)
  // values you need to put in here in order to connect to these services.
  //
  user: 'kinveymobileteam1',
  key: 'EGfszrX4Lx9uykWsqPHX',
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so `wdio` will be called from there.
  //
  updateJob: false,
  specs: [
    'test/browserstack/specs/**'
  ],
  // Patterns to exclude.
  exclude: [
    'test/browserstack/specs/pages/**'
  ],
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  commonCapabilities: {
    'browserstack.selenium_version': '3.0.1',
    'browserstack.local': true,
    'browserstack.debug': true
  },
  capabilities: [{
    os: 'OS X',
    os_version: 'Sierra',
    browser: 'Safari',
    browser_version: '10.0'
  }, {
    os: 'OS X',
    os_version: 'Sierra',
    browser: 'Chrome',
    browser_version: '54.0'
  }, {
    os: 'OS X',
    os_version: 'Sierra',
    browser: 'Firefox',
    browser_version: '49.0'
  }],
  // capabilities: [{
  //   platfrom: 'MAC',
  //   browserName: 'iPhone',
  //   device: 'iPhone 6S'
  // }, {
  //   platform: 'ANDROID',
  //   browserName: 'android',
  //   device: 'Google Nexus 5'
  // }, {
  //   os: 'OS X',
  //   os_version: 'Sierra',
  //   browser: 'Safari',
  //   browser_version: '10.0'
  // }, {
  //   os: 'OS X',
  //   os_version: 'Sierra',
  //   browser: 'Chrome',
  //   browser_version: '54.0'
  // }, {
  //   os: 'OS X',
  //   os_version: 'Sierra',
  //   browser: 'Firefox',
  //   browser_version: '49.0'
  // }, {
  //   os: 'Windows',
  //   os_version: '10',
  //   browser: 'Edge',
  //   browser_version: '13.0'
  // }, {
  //   os: 'Windows',
  //   os_version: '8.1',
  //   browser: 'IE',
  //   browser_version: '11.0'
  // }],
  maxInstances: 2,
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Per default WebdriverIO commands getting executed in a synchronous way using
  // the wdio-sync package. If you still want to run your tests in an async way
  // using promises you can set the sync command to false.
  sync: true,
  //
  // Level of logging verbosity: silent | verbose | command | data | result | error
  logLevel: 'silent',
  //
  // Enables colors for log output.
  coloredLogs: true,
  //
  // Saves a screenshot to a given path if a command fails.
  screenshotPath: 'shots',
  //
  // Set a base URL in order to shorten url command calls. If your url parameter starts
  //  with "/", the base url gets prepended.
  baseUrl: 'http://localhost:3000',
  //
  // Default timeout for all waitForXXX commands.
  waitforTimeout: 1000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  //
  // Framework you want to run your specs with.
  // The following are supported: mocha, jasmine and cucumber
  // see also: http://webdriver.io/guide/testrunner/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed before running any tests.
  framework: 'mocha',
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: http://webdriver.io/guide/testrunner/reporters.html
  reporters: ['spec'],
  //
  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd',
    compilers: ['js:babel-register'],
    timeout: 60000
  },

  // Code to start browserstack local before start of test
  onPrepare: function(config, capabilities) {
    console.log('Connecting local');
    return new Promise(function(resolve, reject) {
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({'key': exports.config.key }, function(error) {
        if (error) return reject(error);
        console.log('Connected. Now testing...');
        resolve();
      });
    });
  },

  // Code to stop browserstack local after end of test
  onComplete: function (capabilties, specs) {
    exports.bs_local.stop(function() {});
  }
};

// Code to support common capabilities
exports.config.capabilities.forEach(function(caps){
  for (var i in exports.config.commonCapabilities) {
    caps[i] = caps[i] || exports.config.commonCapabilities[i];
  }
});
