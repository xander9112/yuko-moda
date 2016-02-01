var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('clean', function (callback) {
	del('site/assets/**/*', callback);
});

gulp.task('build', ['scripts', 'styles', 'images', 'fonts', 'sprite']);

gulp.task('default', function (callback) {
	// В gulp 4 синхронные задачи будут поддерживаться из коробки
	runSequence('clean', ['build'], callback);
});
