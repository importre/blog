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
  var opt = {
    branch: "master"
  };

  del.sync('.publish');
  gulp.src('CNAME').pipe(gulp.dest('./public'));
  return gulp.src('./public/**/*').pipe(ghPages(opt));
});

gulp.task('watch', ['clean'], shell.task([
  'hugo server --watch --verbose'
]));
