/* eslint-disable */
var fs = require('fs-extra')
var path = require('path');
var e2eAppPath = path.resolve(__dirname, '../test/browserstack/app');
var e2eAppConfigFile = path.resolve(__dirname, '../test/browserstack/kinvey.json');

// Make e2e app directory if it doesn't exist
fs.emptyDir(e2eAppPath, function (error) {
  if (error) {
    echo('An error occurred.');
    exit(1);
  }

  if (exec('cd ' + e2eAppPath + ' && yo kinvey-html --config ' + e2eAppConfigFile).code !== 0) {
    echo('An error occurred.');
    exit(1);
  }

  cp(
    path.resolve(__dirname, '../dist/kinvey-html5-sdk.js'),
    path.resolve(__dirname, '../test/browserstack/app/static/bower_components/kinvey-html5-sdk/dist/kinvey-html5-sdk.js')
  );
});
