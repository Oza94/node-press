
var gulp    = require('gulp'),
    nodemon = require('gulp-nodemon'),
    bump    = require('gulp-bump'),
    stylus  = require('gulp-stylus'),
    jshint  = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    pkg     = require('./package.json'),
    paths   = {};

paths.serverScripts = [
  './index.js',
  './config/**/*.js',
  './models/**/*.js',
  './controllers/**/*.js'
];

paths.themeStyles = [
  './public/themes/default/src/index.styl'
];

gulp.task('develop', ['jshint'], function () {
  return nodemon({
    script: './index.js',
    watch: paths.serverScripts
  }).on('change', ['jshint']);
});

gulp.task('jshint', function () {
  return gulp.src(paths.serverScripts).pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('bump', function () {
  return gulp.src('./package.json')
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function () {
  return gulp.src('./package.json')
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:major', function () {
  return gulp.src('./package.json')
    .pipe(bump({type: 'major'}))
    .pipe(gulp.dest('./'));
});

gulp.task('theme-style', function () {
  return gulp.src(paths.themeStyles)
    .pipe(stylus())
    .pipe(gulp.dest('./public/themes/default'));
});