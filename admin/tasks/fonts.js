var gulp = require('gulp');

gulp.task('fonts', function () {
    return gulp.src([
	    'site/src/fonts/**/*',
	    'site/src/vendor/materialize/font/**/*'
    ])
        .pipe(gulp.dest('site/assets/fonts'));
});
