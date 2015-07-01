var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var del = require('delete');
var shell = require('gulp-shell')

gulp.task('clean', shell.task([
  'rm -rf public'
]));

gulp.task('build', ['clean'], shell.task([
  'hugo'
]));

gulp.task('deploy', ['build'], function () {
  del.sync('.publish');
  return gulp.src('./public/**/*').pipe(ghPages());
});

gulp.task('watch', ['clean'], shell.task([
  'hugo server --watch --verbose'
]));
