//const path = require('path');
//const walk = require('klaw-sync');
//const fs = require('fs-extra');

const {
  Runner,
  tasks: { logServer, copy, copyTestRunner, copyTestLibs, runCommand, remove }
} = require('universal-runner');

const serveTests = require("./test/tasks/serveTests");

let logServerPort;

const runner = new Runner({
  pipeline: [
    logServer(),
    serveTests()
  ]
});

runner.on('log.start', port => (logServerPort = port));

runner.run().then(() => console.log('done')).catch(err => console.log(err));
