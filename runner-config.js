const path = require('path');
//const walk = require('klaw-sync');
//const fs = require('fs-extra');
global.appRoot = path.resolve(__dirname);
//TODO - refactor the tests path to be from config
global.testFile = path.join(global.appRoot, 'test/suites/tests.html');


const {
  Runner,
  tasks: { logServer, copy, copyTestRunner, copyTestLibs, runCommand, remove }
} = require('universal-runner');

const serveTests = require("./test/tasks/serveTests");
const webRunTests = require("./test/tasks/webRunTests");

let logServerPort;

const runner = new Runner({
  pipeline: [
    logServer(),
    serveTests(),
    webRunTests()
  ]
});

runner.on('log.start', port => (logServerPort = port));

runner.run().then(() => console.log('done')).catch(err => console.log(err));
