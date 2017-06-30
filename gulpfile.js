var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

/* === < HTML > =================================================================== */
gulp.task('html', function() {
  gulp.src('./src/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: false
    }))
    .pipe(gulp.dest('dist/'));
});

/* === < JS > =================================================================== */
gulp.task('minify-js', function() {
  return gulp.src(['src/js/*.js', 'src/js/vendor/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

/* === < CSS > =================================================================== */
gulp.task('minify-css', function() {
  return gulp.src("src/css/*.css")
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('default', ['html', 'minify-js', 'minify-css']);