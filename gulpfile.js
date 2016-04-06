'use strict';

(function () {  

  var gulp = require('gulp');
  var plumber = require('gulp-plumber');
  var rename = require('gulp-rename');
  var sourcemaps = require('gulp-sourcemaps');
  var sass = require('gulp-sass');
  var autoPrefixer = require('gulp-autoprefixer');
  //if node version is lower than v.0.1.2
  require('es6-promise').polyfill();
  var cleanCss = require('gulp-clean-css');
  var jshint = require('gulp-jshint');
  var browserify = require('gulp-browserify');
  var uglify = require('gulp-uglify');
  var concat = require('gulp-concat');
  var connect = require('gulp-connect');

  var path = (function() {
    var root = __dirname;

    return {
      root: root,
      config: root + '/config',
      dist: root + '/dist',
      app: root + '/src/app',
      assets: root + '/src/assets',
      fixture: root + '/src/fixture',
      bower: root + '/src/bower_components'
    };
  }());

  var config = {
    env: ['dev', 'qa', 'prod']
  };

  var plumperHandler = {
    handleError: function (err) {
      console.log(err);
      this.emit('end');
    }
  };

  gulp.task('compile-sass',function(){
    gulp.src([path.assets + '/styles/scss/**/*.scss'])
      .pipe(plumber(plumperHandler))
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoPrefixer())
      .pipe(concat('main.css'))
      .pipe(gulp.dest(path.assets + '/styles/css'))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(cleanCss())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.assets + '/styles/css'))
      .pipe(connect.reload());
  });

  gulp.task('js',function(){
    gulp.src(['js/src/**/*.js'])
      .pipe(plumber(plumperHandler))
      .pipe(concat('main.js'))
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(browserify())
      .pipe(gulp.dest('js/dist'))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(uglify())
      .pipe(gulp.dest('js/dist'))
  });

  gulp.task('connect', function() {
    connect.server({
      port: 8080,
      root: [path.app, path.fixture, path.assets, path.bower],
      livereload: true
    });
  });
  
  gulp.task('js-dev', function() {  
    gulp.src([path.app + '/**/*.js'])
      // .pipe(plumber(plumperHandler))
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(connect.reload());
      // .pipe(browserify())
      // .pipe(gulp.dest('js/dist'))
      // .pipe(rename({
      //   suffix: '.min'
      // }))
      // .pipe(uglify())
      // .pipe(gulp.dest('js/dist'))
  });


  gulp.task('build', function() {  
    gulp.src(['src/**/*.js'])
      .pipe(plumber(plumperHandler))
      .pipe(concat('main.js'))
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(browserify())
      .pipe(gulp.dest('js/dist'))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(uglify())
      .pipe(gulp.dest('js/dist'))
  });


  gulp.task('install', function() {  

  });

  gulp.task('package', function() {  
    
  });

  gulp.task('serve', function() {
    gulp.watch(path.app + '/**/*.js',['js-dev']);
    gulp.watch(path.assets + '/styles/scss/**/*.scss',['compile-sass']);
  });

  gulp.task('default', ['connect', 'serve']);

}());
