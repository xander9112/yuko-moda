var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var gulpif = require('gulp-if');

var production = require('../gulpfile');

gulp.task('styles', function () {
	return gulp.src([
		'site/src/less/grids.less',
		'site/src/less/grids-responsive.less',
		'site/src/less/bootstrap.less',
		'site/src/less/bootstrap-theme.less',
		'site/src/less/page.less',
		'site/src/less/*.less',
		'site/src/less/**/*.less'
	])
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade:  false
		}))
		.pipe(concat('style.css'))
		.pipe(gulpif(production, csso()))
		.pipe(gulp.dest('site/assets/css/'));
});
