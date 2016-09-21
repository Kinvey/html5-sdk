/* eslint-disable */
var pkg = require('../package.json');
var path = require('path');
var rootDir = path.resolve(__dirname, '..');

// Build
exec('npm run build');

// Copy files
mkdir('-p', path.join(rootDir, 's3'));
cp(path.join(rootDir, 'dist', 'kinvey-html5-sdk.js'), path.join(rootDir, 's3', 'kinvey-html5-sdk-' + pkg.version + '.js'));
cp(path.join(rootDir, 'dist', 'kinvey-html5-sdk.min.js'), path.join(rootDir, 's3', 'kinvey-html5-sdk-' + pkg.version + '.min.js'));
