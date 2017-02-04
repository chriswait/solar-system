var gulp = require('gulp');
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
// var sass = require('gulp-sass');

var jsEntry = './src/js/index';
var jsPath = './src/js/*.js';
var cssPath = './src/css/*.css';
var distPath = './dist';

gulp.task('webpack', function() {
  return gulp.src(jsPath)
  .pipe(plumber())
  .pipe(webpack({
    entry: [
      'babel-polyfill',
      jsEntry
    ],
    output: {
      filename: 'app.js'
    },
    debug: true,
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /.js?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['es2015']
          }
        }
      ]
    }
  }))
  .pipe(gulp.dest(distPath));
});

gulp.task('css', function () {
  gulp.src(cssPath)
  .pipe(concat('app.css'))
  .pipe(gulp.dest(distPath));
});

gulp.task('build', ['webpack', 'css']);

gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});
gulp.task('reload', function() {
  browserSync.reload();
});
gulp.task('watch', function () {
  gulp.watch(jsPath, ['webpack',  'reload']);
  gulp.watch(cssPath, ['css',  'reload']);
});


gulp.task('default', ['serve', 'watch']);
