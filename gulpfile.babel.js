import gulp from 'gulp';
import eslint from 'gulp-eslint';
import util from 'gulp-util';
import plumber from 'gulp-plumber';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import gulpif from 'gulp-if';
import babel from 'gulp-babel';
import buffer from 'gulp-buffer';
import del from 'del';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import s3Upload from 'gulp-s3-upload';
import banner from 'gulp-banner';
import pkg from './package.json';
import bump from 'gulp-bump';
import file from 'gulp-file';
import { argv as args } from 'yargs';

function errorHandler(err) {
  util.log(err.toString());
  this.emit('end');
}

gulp.task('lint', () => {
  const stream = gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
  return stream;
});

gulp.task('clean', (done) => del(['es5', 'dist'], done));

gulp.task('build', ['clean', 'lint'], () => {
  const stream = gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./es5'));
  return stream;
});

gulp.task('bundle', ['build'], () => {
  const header = '/**\n'
    + ` * <%= pkg.name %> v<%= pkg.version %>\n`
    + ' * <%= pkg.description %>\n'
    + ' * <%= pkg.homepage %>\n'
    + ' *\n'
    + ' * Copyright (c) 2016, <%= pkg.author %>.\n'
    + ' * All rights reserved.\n'
    + ' *\n'
    + ' * Released under the <%= pkg.license %> license.\n'
    + ' */\n';

  const stream = gulp.src('./es5/index.js')
    .pipe(gulpWebpack({
      context: `${__dirname}/es5`,
      entry: [
        'babel-regenerator-runtime/runtime.js',
        './popup',
        './device',
        './index.js'
      ],
      output: {
        filename: 'kinvey-html5-sdk.js'
      },
      module: {
        loaders: [
          { test: /\.json$/, loader: 'json' }
        ]
      }
    }, webpack))
    .pipe(banner(header, { pkg: pkg }))
    .pipe(gulp.dest(`${__dirname}/dist`))
    .pipe(rename('kinvey-phonegap-sdk.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(banner(header, { pkg: pkg }))
    .pipe(gulp.dest(`${__dirname}/dist`))
    .on('error', errorHandler);
  return stream;
});

gulp.task('bumpVersion', () => {
  if (!args.type && !args.version) {
    args.type = 'patch';
  }

  const stream = gulp.src('./package.json')
    .pipe(bump({
      preid: 'beta',
      type: args.type,
      version: args.version
    }))
    .pipe(gulp.dest(`${__dirname}/`))
    .on('error', errorHandler);
  return stream;
});

gulp.task('bump', ['bumpVersion'], () => {
  const stream = file('bump.txt', '', { src: true })
    .pipe(gulp.dest(`${__dirname}/tmp`))
    .on('error', errorHandler);
  return stream;
});

gulp.task('uploadS3', ['build'], () => {
  const s3 = s3Upload({
    accessKeyId: process.env.S3ACCESSKEY,
    secretAccessKey: process.env.S3ACCESSSECRET
  });

  const stream = gulp.src([
    'dist/kinvey-html5-sdk.js',
    'dist/kinvey-html5-sdk.min.js'
  ])
    .pipe(plumber())
    .pipe(gulpif('kinvey-html5-sdk.js', rename({ basename: `kinvey-html5-sdk-${pkg.version}` })))
    .pipe(gulpif('kinvey-html5-sdk.min.js', rename({ basename: `kinvey-html5-sdk-${pkg.version}.min` })))
    .pipe(s3({
      Bucket: 'kinvey-downloads/js',
      uploadNewFilesOnly: true
    }, (error, data) => {
      if (error) {
        return errorHandler(error);
      }

      return data;
    }))
    .on('error', errorHandler);
  return stream;
});

gulp.task('default', ['bundle']);
