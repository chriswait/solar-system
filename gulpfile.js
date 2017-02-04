var gulp = require('gulp');
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
// var sass = require('gulp-sass');

var jsEntry = './src/js/app';
var jsPath = './src/js/*.js';
var cssPath = './src/css/*.css';
var distPath = './dist';

var webpackConfig = {
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
          presets: ['es2015'],
          plugins: ['transform-class-properties']
        }
      }
    ]
  }
};
gulp.task('js', function() {
  var stream = gulp.src(jsPath)
  .pipe(plumber())
  .pipe(webpack(webpackConfig))
  .pipe(gulp.dest(distPath));
  return stream;
});
gulp.task('js-watch', ['js'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('css-watch', function () {
  var stream = gulp.src(cssPath)
  .pipe(concat('app.css'))
  .pipe(gulp.dest(distPath));
  return stream;
});

gulp.task('default', ['css-watch', 'js-watch'], function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch(jsPath, ['js-watch']);
  gulp.watch(jsPath, ['css-watch']);
});
