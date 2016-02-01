var $$ = $$ || {};

$$.PageNotFound = class PageNotFound {
	constructor(root) {
		this.root = root;
		this.sources = this.root.data('sources');
		this.currentImageUrl = _.first(this.sources);

		this._cacheNodes();
		this._bindEvents();
		this._ready();
	}

	_cacheNodes () {
		this.nodes = {
			whoIs: this.root.find('.js-who-is')
		};
	}

	_bindEvents () {
		this.nodes.whoIs.on('click', (event) => {
			event.preventDefault();
			this._checkoutImage();
		});
	}

	_ready () {
		this.timeOutId = setTimeout(() => {
			this._checkoutImage();
		}, 8000);
	}

	_checkoutImage () {
		var sources = _.reject(this.sources, (image) => {
			return image === this.currentImageUrl;
		});

		this.currentImageUrl = sources[_.random(sources.length - 1)];
		this.root.css('background-image', `url(${this.currentImageUrl})`);
		clearTimeout(this.timeOutId);

		this.timeOutId = setTimeout(() => {
			this._checkoutImage();
		}, 8000);
	}
};
