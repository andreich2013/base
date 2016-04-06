'use strict';

(function () {  
  //if node version is lower than v.0.1.2
  require('es6-promise').polyfill();

  var gulp = require('gulp');
  var plumber = require('gulp-plumber');
  var rename = require('gulp-rename');
  var sourcemaps = require('gulp-sourcemaps');
  var sass = require('gulp-sass');
  var autoPrefixer = require('gulp-autoprefixer');
  var cleanCss = require('gulp-clean-css');
  var jshint = require('gulp-jshint');
  var browserify = require('gulp-browserify');
  var uglify = require('gulp-uglify');
  var concat = require('gulp-concat');
  var connect = require('gulp-connect');
  var bower = require('gulp-bower');
  var ngConstant = require('gulp-ng-constant');

  var path = (function() {
    var root = __dirname,
        src = root + '/src';

    return {
      root: root,
      config: root + '/config',
      src: src,
      dist: root + '/dist',
      app: src + '/app',
      assets: src + '/assets',
      fixture: src + '/fixture',
      bower: src + '/bower_components'
    };
  }());

  var config = {
    name: 'reeldeal',
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

  gulp.task('js-dev', function() {  
    gulp.src([path.app + '/**/*.js'])
      .pipe(plumber(plumperHandler))
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(connect.reload());
  });

  // gulp.task('js',function(){
  //   gulp.src(['js/src/**/*.js'])
  //     .pipe(plumber(plumperHandler))
  //     .pipe(concat('main.js'))
  //     .pipe(jshint())
  //     .pipe(jshint.reporter('default'))
  //     .pipe(browserify())
  //     .pipe(gulp.dest('js/dist'))
  //     .pipe(rename({
  //       suffix: '.min'
  //     }))
  //     .pipe(uglify())
  //     .pipe(gulp.dest('js/dist'))
  // });

  gulp.task('bower', function() {
    return bower(path.src + '/bower_components');
  });

  gulp.task('ngconstant', function () {
    var tmp = config.env.indexOf(process.env),
        env = tmp !== -1 ? config.env[tmp] : 'dev';

    return ngConstant({
        name: config.name,
        constants: { ENV: require(path.config + '/' + env + '.json') },
        stream: true
      })
      .pipe(rename(path.app + '/rd.main/env.js'))
      .pipe(gulp.dest(path.app + '/rd.main'));
  });

  
  gulp.task('install', [
    'bower',
    'ngconstant'
  ]);

  gulp.task('build', function() {  
    
  });

  gulp.task('test', function() {  
    
  });

  gulp.task('package', function() {  
    
  });

  gulp.task('connect', function() {
    connect.server({
      port: 8080,
      root: [path.src, path.app],
      livereload: true
    });
  });

  gulp.task('serve', function() {
    gulp.watch(path.app + '/**/*.js',['js-dev']);
    gulp.watch(path.assets + '/styles/scss/**/*.scss', ['compile-sass']);
  });

  gulp.task('default', [
    'connect',
    'serve'
  ]);

}());
