var gulp = require('gulp');
var concat = require('gulp-concat');
// var sass = require('gulp-sass');

var vendorPath = [
  'node_modules/three/build/three.min.js',
  'node_modules/three/examples/js/controls/OrbitControls.js'
];
var jsPath = 'src/js/*.js';
var cssPath = 'src/css/*.css';
var distPath = 'dist/';

gulp.task('vendor', function () {
  gulp.src(vendorPath)
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest(distPath));
});

gulp.task('js', function () {
  gulp.src(jsPath)
  .pipe(concat('app.js'))
  .pipe(gulp.dest(distPath));
});

gulp.task('css', function () {
  gulp.src(cssPath)
  .pipe(concat('app.css'))
  .pipe(gulp.dest(distPath));
});

gulp.task('watch', function () {
  gulp.watch(vendorPath, ['vendor']);
  gulp.watch(jsPath, ['js']);
  gulp.watch(cssPath, ['css']);
});

gulp.task('default', ['vendor', 'js', 'css', 'watch']);
