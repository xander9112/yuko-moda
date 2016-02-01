module.exports = {
	//Тут мы укажем куда складывать готовые после сборки файлы
	build: {
		html:         '',
		vendor:       'site/assets/js/',
		js:           'site/assets/js/',
		styles:       'site/assets/css/',
		stylesBlocks: 'site/src/styles/',
		images:       'site/assets/images/',
		sprite:       'site/assets/images/sprite/',
		fonts:        'site/assets/fonts/'
	},
	//Пути откуда брать исходники
	src:   {
		html:         'site/src/html/**/*.html',
		vendor:       [
			'site/src/vendor/jquery-2.1.4.min.js',
			'site/src/vendor/lodash.min.js',
			'site/src/vendor/**/*'
		],
		js:           [
			'site/src/js/utils/*',
			'site/src/js/Component.js',
			'site/src/js/Components/*',
			'site/src/js/Application.js'
		],
		styles:       'site/src/styles/site.less',
		stylesBlocks: [
			'site/src/styles/blocks.less',
			'site/src/styles/blocks/*.less'
		],
		images:       [
			'site/src/images/**/*'
		],
		sprite:       'site/src/images/sprite/*',
		fonts:        'site/src/fonts/**/*'
	},
	//Тут мы укажем, за изменением каких файлов мы хотим наблюдать
	watch: {
		html:         'site/src/html/**/*.html',
		vendor:       [
			'site/src/vendor/**/*'
		],
		js:           [
			'site/src/js/**/*'
		],
		styles:       'site/src/styles/*',
		stylesBlocks: [
			'site/src/styles/blocks/*.less'
		],
		blocks:       'site/src/styles/blocks/*',
		images:       'site/src/images/**/*',
		sprite:       'site/src/images/sprite/*',
		fonts:        'site/src/fonts/**/*'
	},
	clean: 'site/assets/'
};
