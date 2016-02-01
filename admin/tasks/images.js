var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var jpegtran = require('imagemin-jpegtran');

gulp.task('images', function () {
    return gulp.src('site/src/images/**/*')
        .pipe(imagemin({
            progressive: true,
            use: [ jpegtran({ progressive: true }) ]
        }))
        .pipe(gulp.dest('site/assets/images/'));
});
