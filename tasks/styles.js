var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var gulpif = require('gulp-if');

var config = require('./config'),
	production = config.production,
	path = config.path,
	lessImport = require('gulp-less-import'),
	inject = require('gulp-inject');

var browserSync = require("browser-sync"),
	reload = browserSync.reload;

gulp.task('import:build', function () {
	"use strict";

	return gulp
		.src(path.src.stylesBlocks[ 0 ])
		.pipe(inject(gulp.src(path.src.stylesBlocks[ 1 ], { read: false }), {
			relative:  true,
			starttag:  '/* inject:imports */',
			endtag:    '/* endinject */',
			transform: function (filepath) {
				return '@import "' + filepath + '";';
			}
		}))
		.pipe(gulp.dest(path.build.stylesBlocks));
});

gulp.task('styles', function () {
	return gulp.src(path.src.styles)
		.pipe(less())
		.pipe(autoprefixer({
			browsers: [ 'last 2 versions' ],
			cascade:  false
		}))
		.pipe(concat('style.css'))
		.pipe(gulpif(production, csso()))
		.pipe(gulp.dest(path.build.styles))
		.pipe(reload({ stream: true }));
});
