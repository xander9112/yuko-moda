var gulp = require('gulp');
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var config = require('./config'),
	production = config.production,
	path = config.path;

var browserSync = require("browser-sync"),
	reload = browserSync.reload;

gulp.task('images', function () {
	return gulp.src(path.src.images)
		.pipe(plumber())
		.pipe(gulpif(production, imagemin({
			progressive: true,
			svgoPlugins: [ { removeViewBox: false } ],
			use:         [ pngquant() ],
			interlaced:  true
		})))
		.pipe(gulp.dest(path.build.images))
		.pipe(reload({stream: true}));
});
