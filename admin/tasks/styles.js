var gulp = require('gulp');
var plugin = require('gulp-load-plugins')();
var plumber = require('gulp-plumber');

gulp.task('styles', function () {
    return gulp.src([
	    'site/src/vendor/materialize/css/*',
	    'site/src/styles/*.less'
    ])
        .pipe(plumber())
        .pipe(plugin.less())
        .pipe(plugin.autoprefixer({ // TODO: добавить браузеры из ТЗ
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(plugin.concat('styles.css'))
        .pipe(plugin.csso())
        .pipe(gulp.dest('site/assets/css/'));
});
