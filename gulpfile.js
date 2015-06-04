var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var del = require('delete');
var shell = require('gulp-shell')

gulp.task('deploy', function () {
  var opt = {
    branch: "master"
  };
  del.sync('.publish');
  shell.task([
    'rm -rf public',
    'hugo'
  ])
  return gulp.src('./public/**/*').pipe(ghPages(opt));
});