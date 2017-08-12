const os = require('os');
const spawnHeadlessChromium = require('run-headless-chromium').spawn;
const opn = require('opn');
const path = require('path');

function webRunTests() {

  const args = [`http://localhost:${global.staticPort}/${global.testFile}`];

  if (os.type() === 'Windows_NT') {
    opn(global.testFile, { app: ['chrome', '--incognito'] })
      .then((chrome) => {
        chrome.stderr.on('data', d => console.log(d.toString()));

        chrome.on('close', function () {
          //grunt.event.emit('test-end');
        });
      })
      .catch(err => {
        //grunt.event.emit('test-end');
      });
  }
  else {
    const chrome = spawnHeadlessChromium(args);

    chrome.stderr.on('data', d => console.log(d.toString()));

    chrome.on('close', function () {
      //grunt.event.emit('test-end');
    });
  }
};

module.exports = () => ['webRunTests', webRunTests];

