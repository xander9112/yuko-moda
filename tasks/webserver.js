var gulp = require('gulp');
var browserSync = require("browser-sync");

var config = require('./config'),
	production = config.production,
	path = config.path;

gulp.task('server', [ 'watch' ], function () {
	browserSync(config.webserver);
});
