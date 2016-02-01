var gulp = require('gulp');
var gulpif = require('gulp-if'),
	rigger = require('gulp-rigger');

var config = require('./config'),
	production = config.production,
	path = config.path;

var browserSync = require("browser-sync"),
	reload = browserSync.reload;

gulp.task('html', function () {
	gulp.src(path.src.html) //Выберем файлы по нужному пути
		.pipe(rigger()) //Прогоним через rigger
		.pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
		.pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});
