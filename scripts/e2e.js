/* eslint-disable */
var fs = require('fs');
var path = require('path');
var IsThere = require("is-there");
var e2eAppPath = path.resolve(__dirname, '../test/browserstack/app');
var e2eAppConfigFile = path.resolve(__dirname, '../test/browserstack/kinvey.json');

// Make e2e app directory if it doesn't exist
IsThere(e2eAppPath, function(exists) {
  if (exists === false) {
    fs.mkdir(e2eAppPath, function() {
      if (exec('cd ' + e2eAppPath + ' && yo kinvey-html --config ' + e2eAppConfigFile).code !== 0) {
        echo('Error: Git commit failed');
        exit(1);
      }
    });
  }
});
