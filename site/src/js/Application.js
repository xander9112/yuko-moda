var $$ = $$ || {};

class Application {
	constructor () {
		this._initMainSlider();
		this._initSlider();
		this._initHeader();
		this._initPageNotFound();
		this._initContentSlider();
		this._initVideoBlocks();
		this._initTabs();
	}

	_initMainSlider () {
		$('.js-main-slider').each(function () {
			new $$.BannerSlider($(this));
		});
	}

	_initSlider () {
		$('.js-slider').each(function () {
			new $$.Slider($(this));
		});
	}

	_initHeader () {
		$('.js-header-wrapper').each(function () {
			new $$.Header($(this))
		});
	}

	_initPageNotFound () {
		$('.js-page-not-found').each(function () {
			new $$.PageNotFound($(this));
		});
	}

	_initContentSlider () {
		$('.js-content-slider').each(function () {
			new $$.ContentSlider($(this));
		});
	}

	_initVideoBlocks () {
		$('.js-video-block').each(function () {
			new $$.VideoBlock($(this));
		});
	}

	_initTabs () {
		$('.js-tabs-handler').each(function () {
			new $$.Tabs($(this));
		});
	}
}

$(function () {
	$$.window = $(window);
	$$.body = $(document.body);
	$$.windowWidth = $$.window.width();
	$$.windowHeight = $$.window.height();
	$$.application = new Application();
	$$.ESCAPE_KEY_CODE = 27;

	$$.window.on('resize', function () {
		$$.windowWidth = $$.window.width();
		$$.windowHeight = $$.window.height();
	});
});
