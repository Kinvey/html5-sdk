/* eslint-disable */
var path = require('path');
var webpack = require('webpack');
var pkg = require('./package.json');
var BANNER = '/**\n'
  + ' * ' + pkg.name + ' v' + pkg.version + '\n'
  + ' * ' + pkg.description + '\n'
  + ' * ' + pkg.homepage + '\n'
  + ' *\n'
  + ' * Copyright (c) 2016, ' + pkg.author + '.\n'
  + ' * All rights reserved.\n'
  + ' *\n'
  + ' * Released under the ' + pkg.license + ' license.\n'
  + ' */\n';

module.exports = {
  context: path.join(__dirname, 'dist'),
  entry: ['./index.js'],
  output: {
    filename: 'kinvey-html5-sdk.js',
    libraryTarget: 'umd',
    library: 'Kinvey',
    path: path.join(__dirname, 'dist')
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(BANNER, { raw: true })
  ],
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  }
};
