var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var babel = require("gulp-babel");
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');

var browserSync = require("browser-sync"),
	reload = browserSync.reload;

var config = require('./config'),
	production = config.production,
	path = config.path;

gulp.task('scripts', [ 'scripts.vendor', 'scripts.app' ]);

gulp.task('scripts.vendor', function () {
	return gulp.src(path.src.vendor)
		.pipe(plumber())
		.pipe(concat('vendor.js', { newLine: ';\n' }))
		.pipe(gulpif(production, uglify()))
		.pipe(gulp.dest(path.build.vendor))
		.pipe(reload({ stream: true }));
});

gulp.task('scripts.app', function () {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: [ 'es2015' ]
		}))
		.pipe(concat('app.js'))
		.pipe(gulpif(production, uglify()))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({ stream: true }));
});


