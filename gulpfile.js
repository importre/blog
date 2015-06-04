var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var del = require('delete');
var shell = require('gulp-shell')

gulp.task('build', shell.task([
  'rm -rf public',
  'hugo'
]));

gulp.task('deploy', ['build'], function () {
  var opt = {
    branch: "master"
  };
  del.sync('.publish');
  return gulp.src('./public/**/*').pipe(ghPages(opt));
});