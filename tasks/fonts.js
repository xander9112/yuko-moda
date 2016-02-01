var gulp = require('gulp');
var plumber = require('gulp-plumber');

gulp.task('fonts', function () {
    return gulp.src('site/src/fonts/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('site/assets/fonts'));
});