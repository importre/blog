var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var del = require('delete');
var shell = require('gulp-shell');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('clean', shell.task([
  'rm -rf public'
]));

gulp.task('dep', ['clean'], function () {
  del.sync('static/js');
  del.sync('static/css');
  del.sync('static/fonts');
  gulp.src('node_modules/jquery/dist/*')
      .pipe(gulp.dest('static/js'));
  gulp.src('node_modules/bootstrap/dist/css/*')
      .pipe(gulp.dest('static/css'));
  gulp.src('node_modules/bootstrap/dist/fonts/*')
      .pipe(gulp.dest('static/fonts'));
  gulp.src('node_modules/bootstrap/dist/js/*')
      .pipe(gulp.dest('static/js'));
  gulp.src('node_modules/highlight.js/styles/github.css')
      .pipe(gulp.dest('static/css'));
  gulp.src('node_modules/font-awesome/css/*')
      .pipe(gulp.dest('static/css'));
  gulp.src('node_modules/font-awesome/fonts/*')
      .pipe(gulp.dest('static/fonts'));
  browserify('js/highlight.js').bundle()
      .pipe(source('highlight.pack.js'))
      .pipe(gulp.dest('static/js'));
});

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
