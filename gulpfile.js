var gulp = require('gulp');
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');

var jsEntry = './src/js/main';
var jsPath = './src/js/*.js';
var sassPath = './src/sass/*.scss';
var distPath = './dist';
var testPath = './test/*.js';
var testHelperPath = './test/testHelper.js';

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
gulp.task('lint-js', function() {
  var stream = gulp.src(jsPath)
  .pipe(plumber())
  .pipe(eslint())
  .pipe(eslint.format());
  return stream;
});
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
var mochaConfig = {
  compilers: [
    'js:babel-core/register'
  ]
};
gulp.task('test-watch', ['lint-js'], function() {
  gulp.src(testHelperPath)
  .pipe(plumber())
  .pipe(
    mocha(mochaConfig)
  );
});
gulp.task('test', ['test-watch'], function() {
  gulp.watch([jsPath, testPath], ['test-watch']);
});

gulp.task('sass-watch', function () {
  var stream = gulp.src(sassPath)
  .pipe(sass())
  .pipe(concat('app.css'))
  .pipe(gulp.dest(distPath));
  return stream;
});

gulp.task('default', ['sass-watch', 'js-watch', 'test-watch'], function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch(jsPath, ['js-watch']);
  gulp.watch(jsPath, ['sass-watch']);
});
