var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var del = require('delete');

gulp.task('deploy', function () {
  var opt = {
    branch: "master"
  };
  del.sync('.publish');
  return gulp.src('./public/**/*').pipe(ghPages(opt));
});
