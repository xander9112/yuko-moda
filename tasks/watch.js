var gulp = require('gulp');
var config = require('./config'),
	production = config.production,
	path = config.path;


gulp.task('watch', function () {
	gulp.watch(path.watch.vendor, [ 'scripts.vendor' ]);

	gulp.watch(path.watch.js, [ 'scripts.app' ]);

	gulp.watch(path.watch.images, [ 'images' ]);

	gulp.watch(path.watch.sprite, [ 'sprite' ]);

	gulp.watch(path.watch.stylesBlocks, [ 'import:build' ]);
	gulp.watch(path.watch.styles, [ 'styles' ]);

	gulp.watch(path.watch.fonts, [ 'fonts' ]);
});
