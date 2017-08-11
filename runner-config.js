const path = require('path');
const walk = require('klaw-sync');
const fs = require('fs-extra');

const {
  Runner,
  tasks: { logServer, copy, copyTestRunner, copyTestLibs, runCommand, remove }
} = require('universal-runner');


let logServerPort;

const runner = new Runner({
  pipeline: [
    logServer(),
    remove(appRootPath),
    runCommand({
      command: 'tns',
      args: ['create', appName]
    }),
    copy(path.join(__dirname, 'test', 'template'), appPath),
    copy(
      path.join(__dirname, 'test', 'tests'),
      path.join(appPath, 'tests')
    ),
    [
      'createTestsConfig',
      () => {
        const testFiles = walk(path.join(appName, 'app', 'tests'), {
          nodir: true
        }).map(f => `./${path.relative(appPath, f.path)}`);

        const config = `module.exports = ${JSON.stringify(testFiles)};`;

        fs.writeFileSync(path.join(appPath, 'testConfig.js'), config);
      }
    ],
    copyTestLibs(path.join(appPath, 'libs')),
    copyTestRunner(appPath),
    runCommand({
      command: 'adb',
      args: [
        'reverse',
        () => `tcp:${logServerPort}`,
        () => `tcp:${logServerPort}`
      ]
    }),
    runCommand({
      command: 'tns',
      args: ['run', 'android'],
      cwd: appPath
    })
  ]
});

runner.on('log.start', port => (logServerPort = port));

runner.run().then(() => console.log('done')).catch(err => console.log(err));
