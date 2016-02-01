var gulp = require('gulp');
var plumber = require('gulp-plumber');

var browserSync = require("browser-sync"),
	reload = browserSync.reload;

var config = require('./config'),
	production = config.production,
	path = config.path;

gulp.task('fonts', function () {
	return gulp.src(path.src.fonts)
		.pipe(plumber())
		.pipe(gulp.dest(path.build.fonts))
		.pipe(reload({ stream: true }));
});
