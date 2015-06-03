var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');

gulp.task('deploy', function() {
  var opt = {
    branch: "master"
  };
  return gulp.src('./public/**/*').pipe(ghPages(opt));
});
