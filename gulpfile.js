var gulp = require('gulp');
var gutil = require("gulp-util");
var webpack = require("gulp-webpack");
var WebpackDevServer = require("webpack-dev-server");
var livereload = require('gulp-livereload');
var del = require('del');

var webpackConfig = require("./webpack.config.js");

gulp.task('default', function() {
    // place code for your default task here
    // });
});

gulp.task('clean', function (cb) {
  del(['dist/**'], cb);
});

gulp.task('watch', function(cb) {
  // body...
});

gulp.task('webpack', function() {
  return gulp.src('')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/assets/'));
});

gulp.task('copy', function() {
  gulp.src(['src/index.html', 'src/favicon.ico'])
    .pipe(gulp.dest('dist/'));
  gulp.src([
      'src/styles/main.css',
      'bower_components/bootstrap/dist/css/bootstrap.css',
      'bower_components/bootstrap/dist/css/bootstrap.css.map',
      ])
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('build', ['copy', 'webpack']);

gulp.task('watch', function () {
  gulp.watch(['src/index.html', 'src/scripts/**/*', 'src/styles/**/*'], ['build']);
});
