var gulp = require('gulp');
var plugin = require('gulp-load-plugins')();
var plumber = require('gulp-plumber');

gulp.task('scripts', ['scripts.app', 'scripts.vendor']);

gulp.task('scripts.app', function () {
	return gulp.src([
		'site/src/js/utils/*.js',
		'site/src/js/Base.js',
		'site/src/js/Models/**/*.js',
		'site/src/js/Components/**/*.js',
		'site/src/js/Pages/*.js',
		'site/src/js/Application.js'
	])
		.pipe(plumber())
		.pipe(plugin.sourcemaps.init())
		.pipe(plugin.babel())
		.pipe(plugin.concat('app.js', {newLine: ';\n'}))
		//.pipe(plugin.uglify())
		.pipe(plugin.sourcemaps.write('.'))
		.pipe(gulp.dest('site/assets/js/'));
});

gulp.task('scripts.vendor', function () {
	return gulp.src([
		'site/src/vendor/jquery-1.11.3.min.js',
		'site/src/vendor/lodash.js',
		'site/src/vendor/materialize/js/materialize.js',
		'site/src/vendor/*.js'
	])
		.pipe(plumber())
		.pipe(plugin.concat('vendor.js', {newLine: ';\n'}))
//		.pipe(plugin.uglify())
		.pipe(gulp.dest('site/assets/js/'));
});
